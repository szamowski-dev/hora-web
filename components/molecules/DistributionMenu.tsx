import {
  MdChevronRight,
  MdKeyboardArrowDown,
} from "react-icons/md";
import { AppStoreLink } from "@/components/atoms/AppStoreLink";
import { HomebrewCommand } from "@/components/molecules/HomebrewCommand";
import { analyticsAttrs } from "@/lib/analyticsAttrs";
import { ANALYTICS_EVENTS, ANALYTICS_PLACEMENTS } from "@/lib/analyticsSchema";
import type { ProductLandingDistributionOption } from "@/lib/home-model";

type DistributionMenuProps = {
  options: ProductLandingDistributionOption[];
  homebrewCommand: string;
  copyLabel: string;
  copiedLabel: string;
  label: string;
};

function BrandIcon({ kind }: { kind: ProductLandingDistributionOption["kind"] }) {
  if (kind === "mac_app_store") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 fill-current">
        <path d="M8.8086 14.9194l6.1107-11.0368c.0837-.1513.1682-.302.2437-.4584.0685-.142.1267-.2854.1646-.4403.0803-.3259.0588-.6656-.066-.9767-.1238-.3095-.3417-.5678-.6201-.7355a1.4175 1.4175 0 0 0-.921-.1924c-.3207.043-.6135.1935-.8443.4288-.1094.1118-.1996.2361-.2832.369-.092.1463-.175.2979-.259.4492l-.3864.6979-.3865-.6979c-.0837-.1515-.1667-.303-.2587-.4492-.0837-.1329-.1739-.2572-.2835-.369-.2305-.2353-.5233-.3857-.844-.429a1.4181 1.4181 0 0 0-.921.1926c-.2784.1677-.4964.426-.6203.7355-.1246.311-.1461.6508-.066.9767.038.155.0962.2984.1648.4403.0753.1564.1598.307.2437.4584l1.248 2.2543-4.8625 8.7825H2.0295c-.1676 0-.3351-.0007-.5026.0092-.1522.009-.3004.0284-.448.0714-.3108.0906-.5822.2798-.7783.548-.195.2665-.3006.5929-.3006.9279 0 .3352.1057.6612.3006.9277.196.2683.4675.4575.7782.548.1477.043.296.0623.4481.0715.1675.01.335.009.5026.009h13.0974c.0171-.0357.059-.1294.1-.2697.415-1.4151-.6156-2.843-2.0347-2.843zM3.113 18.5418l-.7922 1.5008c-.0818.1553-.1644.31-.2384.4705-.067.1458-.124.293-.1611.452-.0785.3346-.0576.6834.0645 1.0029.1212.3175.3346.583.607.7549.2727.172.5891.2416.9013.1975.3139-.044.6005-.1986.8263-.4402.1072-.1148.1954-.2424.2772-.3787.0902-.1503.1714-.3059.2535-.4612L6 19.4636c-.0896-.149-.9473-1.4704-2.887-.9218m20.5861-3.0056a1.4707 1.4707 0 0 0-.779-.5407c-.1476-.0425-.2961-.0616-.4483-.0705-.1678-.0099-.3352-.0091-.503-.0091H18.648l-4.3891-7.817c-.6655.7005-.9632 1.485-1.0773 2.1976-.1655 1.0333.0367 2.0934.546 3.0004l5.2741 9.3933c.084.1494.167.299.2591.4435.0837.131.1739.2537.2836.364.231.2323.5238.3809.8449.4232.3192.0424.643-.0244.9217-.1899.2784-.1653.4968-.4204.621-.7257.1246-.3072.146-.6425.0658-.9641-.0381-.1529-.0962-.2945-.165-.4346-.0753-.1543-.1598-.303-.2438-.4524l-1.216-2.1662h1.596c.1677 0 .3351.0009.5029-.009.1522-.009.3007-.028.4483-.0705a1.4707 1.4707 0 0 0 .779-.5407A1.5386 1.5386 0 0 0 24 16.452a1.539 1.539 0 0 0-.3009-.9158Z" />
      </svg>
    );
  }

  if (kind === "setapp") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 fill-current">
        <path d="M13.0949 8.1332a.619.619 0 0 1 0-.874l2.7712-2.7733a.619.619 0 0 1 .877 0l2.7703 2.7722a.619.619 0 0 1 0 .8751l-2.7703 2.7722a.619.619 0 0 1-.877 0zm-1.5331-1.5331L8.7906 3.8299a.618.618 0 0 1 0-.877L11.5618.1815a.619.619 0 0 1 .876 0l2.7732 2.7712a.619.619 0 0 1 0 .877L12.4378 6.6a.619.619 0 0 1-.876 0zm0 2.1902a.619.619 0 0 1 .876 0l2.7732 2.7712a.619.619 0 0 1 0 .877l-2.7732 2.7712a.619.619 0 0 1-.876 0l-2.7712-2.7692a.618.618 0 0 1 0-.877zm-4.3044 2.1151L4.4862 8.1332a.619.619 0 0 1 0-.876l2.7712-2.7713a.619.619 0 0 1 .8761 0l2.7722 2.7712a.621.621 0 0 1 0 .8761l-2.7732 2.7722a.619.619 0 0 1-.876 0zm9.4847 2.1902 2.7723 2.7712a.618.618 0 0 1 0 .875l-2.7703 2.7723a.619.619 0 0 1-.876 0l-2.7732-2.7722a.621.621 0 0 1 0-.8751l2.7732-2.7722a.619.619 0 0 1 .875 0zm-4.3043 4.3033 2.7722 2.7722a.618.618 0 0 1 0 .876l-2.7722 2.7713a.619.619 0 0 1-.876 0l-2.7712-2.7712a.619.619 0 0 1 0-.877l2.7712-2.7713a.619.619 0 0 1 .876 0zm-1.532-1.5321a.619.619 0 0 1 0 .875l-2.7723 2.7733a.621.621 0 0 1-.876 0l-2.7723-2.7722a.619.619 0 0 1 0-.8751l2.7722-2.7722a.619.619 0 0 1 .8761 0z" />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 180 226"
      className="h-6 w-5 fill-current stroke-current"
      strokeLinejoin="round"
    >
      <path d="m155.714 186.084a18 18 0 0 0 18.064-17.998c.002-18.273.002-46.51.002-64.833a18 18 0 0 0 -18-18h-14.838a4 4 0 0 1 -4-4v-9.43h-117.03l.295 138.213a4.001 4.001 0 0 0 1.85 3.365c5.212 3.018 21.921 8.75 57.004 8.75 35.825 0 51.839-7.674 56.424-11.139a3.979 3.979 0 0 0 1.438-3.062c.019-3.825.019-12.688.019-17.924a3.999 3.999 0 0 1 4.083-3.999c4.401.062 9.674.071 14.689.057zm-18.772-79.806c0-1.326.527-2.598 1.464-3.536a5.004 5.004 0 0 1 3.536-1.464h12.738c1.326 0 2.598.527 3.536 1.464a5.004 5.004 0 0 1 1.464 3.536v58.185a5.004 5.004 0 0 1 -1.464 3.536 5.004 5.004 0 0 1 -3.536 1.464h-12.738a5.004 5.004 0 0 1 -3.536-1.464 5.004 5.004 0 0 1 -1.464-3.536z" fillRule="nonzero" strokeWidth="4.79" />
      <path d="m31.449 70.663v123.986c0 1.431.764 2.753 2.003 3.467 5.061 2.412 19.743 8.169 45.484 8.169 25.912 0 40.158-6.995 44.928-9.878a3.987 3.987 0 0 0 1.827-3.351c.011-16.441.011-122.393.011-122.393z" />
      <g strokeLinecap="round">
        <path d="m35.521.249v112.816" fill="none" strokeLinejoin="miter" strokeWidth="11.96" transform="matrix(1 0 0 .84931 9.782 91.452)" />
        <path d="m43.739 28.505c2.473-4.998 7.628-8.088 13.574-8.44 7.167-.424 11.167 4.197 11.167 3.787 0-11.012 8.928-19.938 19.941-19.938 11.014 0 19.936 8.926 19.936 19.938 0 .113 4.241-4.967 10.965-4.783 7.924.217 14.355 6.427 14.355 14.355 0 4.103-4.236 10.728-4.236 10.728a15.073 15.073 0 0 1 7.432-1.957 15.09 15.09 0 0 1 9.59 3.421 15.119 15.119 0 0 1 5.708 11.851c0 7.666-5.691 14.001-13.079 15.012a22.339 22.339 0 0 0 -4.891 1.27c-4.391 1.655-8.881 3.027-13.417 4.159a16.66 16.66 0 0 1 -1.909 6.231 20.723 20.723 0 0 0 -2.38 11.257c-.002.236.007 1.472.007 1.71 0 4.956-4.016 7.972-8.976 7.972a8.971 8.971 0 0 1 -8.971-8.972c0-2-1.177-4.388-3.11-5.587a16.564 16.564 0 0 1 -1.3-.873 16.842 16.842 0 0 1 -5.746-7.424c-25.55.846-48.861-3.64-60.612-6.809a98.218 98.218 0 0 0 -9.171-2.13 15.439 15.439 0 0 1 -7.83-4.151 15.112 15.112 0 0 1 -4.713-10.985c0-8.245 6.581-14.952 14.781-15.149-6.472-5.418.795-18.648 11.537-19.148 5.566-.259 11.348 4.655 11.348 4.655z" strokeWidth="4.79" />
      </g>
    </svg>
  );
}

function MenuLink({ option }: { option: ProductLandingDistributionOption }) {
  const content = (
    <>
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-overlay text-text/85">
        <BrandIcon kind={option.kind} />
      </span>
      <span className="min-w-0 flex-1 text-left">
        <span className="block text-sm font-semibold text-text">{option.title}</span>
        <span className="mt-0.5 block text-sm leading-5 text-muted">{option.description}</span>
      </span>
      <MdChevronRight aria-hidden="true" className="size-5 shrink-0 text-muted" />
    </>
  );
  const className =
    "group flex w-full items-center gap-3 rounded-2xl p-3 transition-colors hover:bg-overlay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";
  const props = analyticsAttrs(
    option.kind === "mac_app_store"
      ? "app_store_cta_click"
      : ANALYTICS_EVENTS.downloadClick,
    {
      link_text: option.title,
      link_url: option.href,
      destination: option.kind,
      placement: ANALYTICS_PLACEMENTS.hero,
    },
  );

  if (option.kind === "mac_app_store") {
    return (
      <AppStoreLink
        href={option.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        {...props}
      >
        {content}
      </AppStoreLink>
    );
  }

  return (
    <a
      href={option.href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      {...props}
    >
      {content}
    </a>
  );
}

function HomebrewOption({
  option,
  homebrewCommand,
  copyLabel,
  copiedLabel,
}: {
  option: ProductLandingDistributionOption;
  homebrewCommand: string;
  copyLabel: string;
  copiedLabel: string;
}) {
  return (
    <details className="group rounded-2xl">
      <summary
        className="flex w-full cursor-pointer list-none items-center gap-3 rounded-2xl p-3 text-left transition-colors hover:bg-overlay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent [&::-webkit-details-marker]:hidden"
        {...analyticsAttrs(ANALYTICS_EVENTS.downloadClick, {
          link_text: option.title,
          link_url: option.href,
          destination: option.kind,
          placement: ANALYTICS_PLACEMENTS.hero,
        })}
      >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-overlay text-text/85">
            <BrandIcon kind={option.kind} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-text">{option.title}</span>
            <span className="mt-0.5 block text-sm leading-5 text-muted">{option.description}</span>
          </span>
          <MdChevronRight aria-hidden="true" className="size-5 shrink-0 text-muted" />
      </summary>
      <div className="px-3 pb-3">
        <HomebrewCommand
          command={homebrewCommand}
          copyLabel={copyLabel}
          copiedLabel={copiedLabel}
        />
      </div>
    </details>
  );
}

export function DistributionMenu({
  options,
  homebrewCommand,
  copyLabel,
  copiedLabel,
  label,
}: DistributionMenuProps) {
  if (!options.length) return null;

  return (
    <details
      className="group relative"
      data-analytics-open-event="distribution_menu_open"
      data-analytics-open-props={JSON.stringify({
        menu_id: "homepage_distribution",
        placement: ANALYTICS_PLACEMENTS.hero,
      })}
    >
      <summary
        className="inline-flex h-12 cursor-pointer list-none items-center justify-center gap-2 whitespace-nowrap rounded-full [corner-shape:superellipse(1.6)] border border-line-strong bg-overlay px-7 text-[15px] font-semibold text-text shadow-[inset_0_1px_0_var(--ui-highlight)] transition-[background-color,border-color,color,box-shadow,transform] hover:border-white/20 hover:bg-overlay-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg [&::-webkit-details-marker]:hidden"
        aria-label={label}
      >
        {label}
        <MdKeyboardArrowDown
          aria-hidden="true"
          className="size-5 transition-transform group-open:rotate-180"
        />
      </summary>
      <div
        role="menu"
        aria-label={label}
        className="absolute left-1/2 top-[calc(100%+0.75rem)] z-30 w-[min(24rem,calc(100vw-2.5rem))] -translate-x-1/2 rounded-[24px] border border-line-strong bg-panel-deep p-2 text-left shadow-[0_28px_70px_-28px_var(--ui-shadow-neutral)]"
      >
        {options.map((option) =>
          option.kind === "homebrew" ? (
            <HomebrewOption
              key={option.kind}
              option={option}
              homebrewCommand={homebrewCommand}
              copyLabel={copyLabel}
              copiedLabel={copiedLabel}
            />
          ) : (
            <MenuLink key={option.kind} option={option} />
          ),
        )}
      </div>
    </details>
  );
}
