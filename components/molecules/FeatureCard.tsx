import { Icon, type IconName } from "@/components/atoms/Icon";
import { Tag } from "@/components/atoms/Tag";
import { cn } from "@/lib/cn";

export function FeatureCard({
  icon,
  title,
  description,
  badges,
  className,
}: {
  icon?: IconName;
  title: string;
  description: string;
  badges?: readonly string[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-white/2 p-6 transition-colors hover:border-[#2a2a2a]",
        className,
      )}
    >
      {icon ? <Icon name={icon} className="mb-4 text-accent" size={28} /> : null}
      <h3 className="mb-1.5 text-base font-semibold text-text">{title}</h3>
      <p className="text-sm leading-relaxed text-muted">{description}</p>
      {badges && badges.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {badges.map((b) => (
            <Tag key={b} className="text-[11px]">
              {b}
            </Tag>
          ))}
        </div>
      ) : null}
    </div>
  );
}
