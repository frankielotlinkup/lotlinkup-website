import Link from "next/link";
import { Container } from "./container";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-paper-warm text-ink border-t border-paper-edge">
      <Container>
        <div className="grid gap-12 py-16 md:grid-cols-3 md:gap-8 lg:py-20">
          <div>
            <p className="font-serif text-2xl font-normal tracking-[-0.01em] text-accent">
              Lot Linkup
            </p>
            <p className="type-body text-ink-soft mt-3 max-w-xs">
              Rural land, made accessible.
            </p>
            <p className="type-small text-ink-soft mt-6">
              © {year} Lot Linkup. All rights reserved.
            </p>
          </div>
          <div>
            <p className="type-caption text-ink-soft mb-4">Explore</p>
            <ul className="flex flex-col gap-3">
              <li>
                <Link
                  href="/land-for-sale"
                  className="type-body hover:text-accent transition-colors"
                >
                  Land for Sale
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="type-body hover:text-accent transition-colors"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="type-body hover:text-accent transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="type-caption text-ink-soft mb-4">Legal</p>
            <ul className="flex flex-col gap-3">
              <li>
                <Link
                  href="/privacy"
                  className="type-body hover:text-accent transition-colors"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="type-body hover:text-accent transition-colors"
                >
                  Terms
                </Link>
              </li>
            </ul>
            <div className="mt-6 flex flex-col gap-1">
              <a
                href="mailto:andrew@lotlinkup.com"
                className="type-small text-ink-soft hover:text-accent transition-colors"
              >
                andrew@lotlinkup.com
              </a>
              <a
                href="mailto:frankie@lotlinkup.com"
                className="type-small text-ink-soft hover:text-accent transition-colors"
              >
                frankie@lotlinkup.com
              </a>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
