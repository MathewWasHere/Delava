"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  ACTIVE_ADMIN_KEY,
  DEFAULT_STAFF,
  STAFF_STORAGE_KEY,
  can,
  readActiveAdmin,
  readStaff,
  roleLabel,
  writeStaff,
  type Permission,
  type Role,
  type StaffMember,
} from "@/lib/roles";

/* --------------------------------------------------------------------------
 * The staff table lives in localStorage, which is an external store — so we
 * subscribe to it with useSyncExternalStore rather than mirroring it into
 * component state via an effect (the React Compiler rejects setState-in-effect,
 * and mirroring would desync the sidebar from the settings page).
 * ------------------------------------------------------------------------ */

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

/* Snapshots must be referentially stable or useSyncExternalStore loops. */
let staffCache: StaffMember[] | null = null;
let staffCacheRaw: string | null = null;

function staffSnapshot(): StaffMember[] {
  const raw = (() => {
    try {
      return localStorage.getItem(STAFF_STORAGE_KEY);
    } catch {
      return null;
    }
  })();
  if (raw !== staffCacheRaw || staffCache === null) {
    staffCacheRaw = raw;
    staffCache = readStaff();
  }
  return staffCache;
}

function staffServerSnapshot(): StaffMember[] {
  return DEFAULT_STAFF;
}

let adminCache: StaffMember | null = null;
let adminCacheKey = "";

function adminSnapshot(): StaffMember {
  const key = (() => {
    try {
      return (
        (localStorage.getItem(ACTIVE_ADMIN_KEY) ?? "") +
        "|" +
        (localStorage.getItem(STAFF_STORAGE_KEY) ?? "")
      );
    } catch {
      return "";
    }
  })();
  if (key !== adminCacheKey || adminCache === null) {
    adminCacheKey = key;
    adminCache = readActiveAdmin();
  }
  return adminCache;
}

function adminServerSnapshot(): StaffMember {
  return DEFAULT_STAFF[0];
}

/** The staff directory plus mutators. */
export function useStaff() {
  const staff = useSyncExternalStore(subscribe, staffSnapshot, staffServerSnapshot);

  const upsert = useCallback((member: StaffMember) => {
    const next = readStaff().slice();
    const i = next.findIndex((s) => s.phone === member.phone);
    if (i >= 0) next[i] = member;
    else next.push(member);
    writeStaff(next);
    emit();
  }, []);

  const remove = useCallback((phone: string) => {
    writeStaff(readStaff().filter((s) => s.phone !== phone));
    emit();
  }, []);

  const setRole = useCallback((phone: string, role: Role) => {
    const next = readStaff().map((s) => (s.phone === phone ? { ...s, role } : s));
    writeStaff(next);
    emit();
  }, []);

  return { staff, upsert, remove, setRole };
}

/** Who is currently operating the admin panel. */
export function useCurrentAdmin() {
  const member = useSyncExternalStore(subscribe, adminSnapshot, adminServerSnapshot);

  const switchTo = useCallback((phone: string) => {
    try {
      localStorage.setItem(ACTIVE_ADMIN_KEY, phone);
    } catch {
      /* ignore */
    }
    emit();
  }, []);

  return {
    ...member,
    roleLabel: roleLabel(member.role),
    switchTo,
  };
}

/** Permission check bound to the current admin. */
export function usePermission(): (p: Permission) => boolean {
  const me = useCurrentAdmin();
  return useCallback((p: Permission) => can(me.role, p), [me.role]);
}
