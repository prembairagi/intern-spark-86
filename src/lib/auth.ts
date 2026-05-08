import { useEffect, useState, useCallback } from "react";
import { db, type User, type Role } from "./data";

export function useDb() {
  const [data, setData] = useState(() => db.get());
  useEffect(() => {
    const handler = () => setData(db.get());
    window.addEventListener("imp_db_change", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("imp_db_change", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);
  return data;
}

export function useCurrentUser(): User | null {
  const data = useDb();
  if (!data.session.userId) return null;
  return data.users.find((u) => u.id === data.session.userId) ?? null;
}

export function useAuth() {
  const user = useCurrentUser();

  const login = useCallback((email: string, password: string): User | null => {
    const data = db.get();
    const found = data.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
    );
    if (!found) return null;
    data.session.userId = found.id;
    db.set(data);
    return found;
  }, []);

  const register = useCallback(
    (input: {
      name: string;
      email: string;
      password: string;
      role: Role;
      extra?: { companyName?: string; industry?: string; university?: string; degree?: string };
    }): { ok: true; user: User } | { ok: false; error: string } => {
      const data = db.get();
      if (data.users.some((u) => u.email.toLowerCase() === input.email.toLowerCase())) {
        return { ok: false, error: "An account with this email already exists." };
      }
      const user: User = {
        id: "u_" + db.uid(),
        name: input.name,
        email: input.email,
        password: input.password,
        role: input.role,
        createdAt: new Date().toISOString(),
      };
      data.users.push(user);

      if (input.role === "student") {
        data.studentProfiles.push({
          userId: user.id,
          university: input.extra?.university ?? "",
          degree: input.extra?.degree ?? "",
          graduationYear: new Date().getFullYear() + 1,
          skills: [],
          bio: "",
        });
      } else if (input.role === "company") {
        data.companyProfiles.push({
          userId: user.id,
          companyName: input.extra?.companyName ?? input.name,
          industry: input.extra?.industry ?? "",
          website: "",
          description: "",
          status: "pending",
        });
        data.notifications.push({
          id: "n_" + db.uid(),
          userId: "u_admin",
          title: "New company pending approval",
          message: `${input.extra?.companyName ?? input.name} signed up and is awaiting approval.`,
          read: false,
          createdAt: new Date().toISOString(),
        });
      }
      data.session.userId = user.id;
      db.set(data);
      return { ok: true, user };
    },
    [],
  );

  const logout = useCallback(() => {
    const data = db.get();
    data.session.userId = null;
    db.set(data);
  }, []);

  return { user, login, register, logout };
}
