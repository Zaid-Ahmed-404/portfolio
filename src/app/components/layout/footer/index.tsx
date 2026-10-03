import { navLinks, profile } from "@/data/content";
import { format, getDictionary, type Locale } from "@/i18n";
import { ArrowUpRight, Github, Linkedin } from "../../shared/icons";
import Logo from "../logo";

const socials = [
  { label: "GitHub", href: profile.github, Icon: Github },
  { label: "LinkedIn", href: profile.linkedin, Icon: Linkedin },
];

const Footer = ({ locale }: { locale: Locale }) => {
  const dict = getDictionary(locale);
  const t = dict.footer;
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line">
      <div className="container py-12">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="flex max-w-xs flex-col gap-4">
            <Logo locale={locale} />
            <p className="text-sm leading-relaxed">{t.tagline}</p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:gap-16">
            <div className="flex flex-col gap-3">
              <span className="eyebrow">{t.navigate}</span>
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} className="w-fit text-sm text-body transition-colors hover:text-fg">
                  {dict.nav[link.key]}
                </a>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              <span className="eyebrow">{t.connect}</span>
              {socials.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex w-fit items-center gap-2 text-sm text-body transition-colors hover:text-fg"
                >
                  <Icon size={14} />
                  {label}
                  <ArrowUpRight size={13} className="opacity-0 transition-opacity group-hover:opacity-100 rtl:-scale-x-100" />
                </a>
              ))}
              <a href={`mailto:${profile.email}`} className="w-fit text-sm text-body transition-colors hover:text-fg">
                {t.email}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted">{format(t.rights, { year })}</p>
          <p className="font-mono text-xs text-muted">{t.builtWith}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
