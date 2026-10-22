import type { ReactNode } from "react";
import { SiteFrame } from "./SiteFrame";
import { AccountNav } from "./AccountNav";
import { SignOutButton } from "./SignOutButton";

export function AccountShell({
  children,
  active,
  name,
  email,
  role,
}: {
  children: ReactNode;
  active: string;
  name: string;
  email: string;
  role: string;
}) {
  return (
    <SiteFrame>
      <main id="main-content">
        <section className="account-hero">
          <div className="page-container">
            <div className="account-topline">
              <div>
                <span className="eyebrow">Nigeria outreach workspace</span>
                <h1>Team account</h1>
                <p>
                  {name} · {email} · {role.replaceAll("_", " ")}
                </p>
              </div>
              <SignOutButton />
            </div>
            <AccountNav active={active} />
          </div>
        </section>
        {children}
      </main>
    </SiteFrame>
  );
}
