"use client";

import { Package } from "lucide-react";
import { Route, RouteGroup } from "@/types/Route";
const ContentGroupsIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" className="injected-svg" data-src="https://cdn.hugeicons.com/icons/layers-02-stroke-rounded.svg" xlink="http://www.w3.org/1999/xlink" role="img" color="currentColor">
      <rect x="11" y="2" width="11" height="11" rx="2.5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 6.50049C8.97247 6.50414 7.91075 6.55392 7.23223 7.23243C6.5 7.96467 6.5 9.14318 6.5 11.5002V12.5002C6.5 14.8572 6.5 16.0357 7.23223 16.768C7.96447 17.5002 9.14298 17.5002 11.5 17.5002H12.5C14.857 17.5002 16.0355 17.5002 16.7678 16.768C17.4463 16.0895 17.4961 15.0277 17.4997 13.0002" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.5 11.0005C4.47247 11.0041 3.41075 11.0539 2.73223 11.7324C2 12.4647 2 13.6432 2 16.0002V17.0002C2 19.3572 2 20.5357 2.73223 21.268C3.46447 22.0002 4.64298 22.0002 7 22.0002H8C10.357 22.0002 11.5355 22.0002 12.2678 21.268C12.9463 20.5895 12.9961 19.5277 12.9997 17.5002" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};
const MediaIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" className="injected-svg" xlink="http://www.w3.org/1999/xlink" role="img" color="currentColor">
      <path d="M6 17.9745C6.1287 19.2829 6.41956 20.1636 7.07691 20.8209C8.25596 22 10.1536 22 13.9489 22C17.7442 22 19.6419 22 20.8209 20.8209C22 19.6419 22 17.7442 22 13.9489C22 10.1536 22 8.25596 20.8209 7.07691C20.1636 6.41956 19.2829 6.1287 17.9745 6" stroke="currentColor" strokeWidth={2} />
      <path d="M2 10C2 6.22876 2 4.34315 3.17157 3.17157C4.34315 2 6.22876 2 10 2C13.7712 2 15.6569 2 16.8284 3.17157C18 4.34315 18 6.22876 18 10C18 13.7712 18 15.6569 16.8284 16.8284C15.6569 18 13.7712 18 10 18C6.22876 18 4.34315 18 3.17157 16.8284C2 15.6569 2 13.7712 2 10Z" stroke="currentColor" strokeWidth={2} />
      <path d="M2 11.1185C2.61902 11.0398 3.24484 11.001 3.87171 11.0023C6.52365 10.9533 9.11064 11.6763 11.1711 13.0424C13.082 14.3094 14.4247 16.053 15 18" stroke="currentColor" strokeWidth={2} strokeLinejoin="round" />
      <path d="M12.9998 7H13.0088" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const SiteContentIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" className="injected-svg" data-src="https://cdn.hugeicons.com/icons/carousel-vertical-stroke-rounded.svg" xlink="http://www.w3.org/1999/xlink" role="img" color="currentColor">
      <path d="M16 7C18.357 7 19.5355 7 20.2678 7.73223C21 8.46447 21 9.64298 21 12C21 14.357 21 15.5355 20.2678 16.2678C19.5355 17 18.357 17 16 17H8C5.64298 17 4.46447 17 3.73223 16.2678C3 15.5355 3 14.357 3 12C3 9.64298 3 8.46447 3.73223 7.73223C4.46447 7 5.64298 7 8 7L16 7Z" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 2C16.8955 2.54697 16.7107 2.94952 16.3838 3.26777C15.6316 4 14.4211 4 12 4C9.5789 4 8.36835 4 7.61621 3.26777C7.28931 2.94952 7.10449 2.54697 7 2" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 22C16.8955 21.453 16.7107 21.0505 16.3838 20.7322C15.6316 20 14.4211 20 12 20C9.5789 20 8.36835 20 7.61621 20.7322C7.28931 21.0505 7.10449 21.453 7 22" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};
const StringCatalogIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none">
      <path d="M12 14.5V22" stroke="currentColor" strokeWidth={2} />
      <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2M12 12C9.23858 12 7 9.76142 7 7C7 4.23858 9.23858 2 12 2M12 12C13.1046 12 14 9.76142 14 7C14 4.23858 13.1046 2 12 2M12 12C10.8954 12 10 9.76142 10 7C10 4.23858 10.8954 2 12 2" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19.0859 4.84126L21.9871 4.05904C21.9935 4.05711 22 4.06191 22 4.0686V18.9795L12.0495 22L2 18.997V4.0139C2 4.00716 2.00653 4.00236 2.01297 4.00437L5.08072 4.84126" stroke="currentColor" strokeWidth={2} />
    </svg>
  );
};
const BlogIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" color="currentColor" fill="none">
      <path d="M19.7502 11V10C19.7502 6.22876 19.7502 4.34315 18.5786 3.17157C17.407 2 15.5214 2 11.7502 2H10.7503C6.97907 2 5.09346 2 3.92189 3.17156C2.75032 4.34312 2.7503 6.22872 2.75027 9.99993L2.75024 14C2.7502 17.7712 2.75019 19.6568 3.92172 20.8284C5.09329 21.9999 6.97897 22 10.7502 22" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.25024 7H15.2502M7.25024 12H15.2502" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
      <path d="M13.2502 20.8268V22H14.4236C14.833 22 15.0377 22 15.2217 21.9238C15.4058 21.8475 15.5505 21.7028 15.84 21.4134L20.6636 16.5894C20.9366 16.3164 21.0731 16.1799 21.1461 16.0327C21.285 15.7525 21.285 15.4236 21.1461 15.1434C21.0731 14.9961 20.9366 14.8596 20.6636 14.5866C20.3905 14.3136 20.254 14.1771 20.1067 14.1041C19.8265 13.9653 19.4975 13.9653 19.2173 14.1041C19.0701 14.1771 18.9335 14.3136 18.6605 14.5866L18.6605 14.5866L13.8369 19.4106C13.5474 19.7 13.4027 19.8447 13.3265 20.0287C13.2502 20.2128 13.2502 20.4174 13.2502 20.8268Z" stroke="currentColor" strokeWidth={2} strokeLinejoin="round" />
    </svg>
  );
};

const MailSettingsIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" color="currentColor" fill="none">
      <path d="M2 5L8.91302 8.92462C11.4387 10.3585 12.5613 10.3585 15.087 8.92462L22 5" stroke="currentColor" strokeWidth={2} strokeLinejoin="round" />
      <path d="M11.0005 19.4892C11.0005 19.4892 10.0696 19.5136 9.09925 19.4892C5.95057 19.4099 4.37623 19.3703 3.24503 18.2332C2.11384 17.096 2.08115 15.5609 2.01577 12.4907C1.99474 11.5036 1.99474 10.5222 2.01577 9.53502C2.08114 6.46485 2.11383 4.92976 3.24503 3.7926C4.37623 2.65545 5.95057 2.61584 9.09925 2.53662C11.0399 2.48779 12.9614 2.48779 14.902 2.53662C18.0506 2.61585 19.625 2.65547 20.7562 3.79262C21.8874 4.92977 21.9201 6.46486 21.9854 9.53504C21.993 9.89243 21.9979 10.5116 22 11.0129" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 20.2143V21.5M18 20.2143C16.8432 20.2143 15.8241 19.6461 15.2263 18.7833M18 20.2143C19.1568 20.2143 20.1759 19.6461 20.7737 18.7833M18 13.7857C19.1569 13.7857 20.1761 14.354 20.7738 15.2169M18 13.7857C16.8431 13.7857 15.8239 14.354 15.2262 15.2169M18 13.7857V12.5M22 14.4286L20.7738 15.2169M14.0004 19.5714L15.2263 18.7833M14 14.4286L15.2262 15.2169M21.9996 19.5714L20.7737 18.7833M20.7738 15.2169C21.1273 15.7271 21.3333 16.3403 21.3333 17C21.3333 17.6597 21.1272 18.273 20.7737 18.7833M15.2262 15.2169C14.8727 15.7271 14.6667 16.3403 14.6667 17C14.6667 17.6597 14.8728 18.273 15.2263 18.7833" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
};
const HomeIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" color="currentColor" fill="none">
      <path d="M12.0002 18L12.0002 15" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
      <path d="M2.35157 13.2135C1.99855 10.9162 1.82204 9.76763 2.25635 8.74938C2.69065 7.73112 3.65421 7.03443 5.58132 5.64106L7.02117 4.6C9.41847 2.86667 10.6171 2 12.0002 2C13.3832 2 14.5819 2.86667 16.9792 4.6L18.419 5.64106C20.3462 7.03443 21.3097 7.73112 21.744 8.74938C22.1783 9.76763 22.0018 10.9162 21.6488 13.2135L21.3478 15.1724C20.8473 18.4289 20.5971 20.0572 19.4292 21.0286C18.2613 22 16.5538 22 13.139 22H10.8614C7.44652 22 5.73909 22 4.57118 21.0286C3.40327 20.0572 3.15305 18.4289 2.65261 15.1724L2.35157 13.2135Z" stroke="currentColor" strokeWidth={2} strokeLinejoin="round" />
    </svg>
  );
};
const MailIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" color="currentColor" fill="none">
      <path d="M7 8.5L9.94202 10.2394C11.6572 11.2535 12.3428 11.2535 14.058 10.2394L17 8.5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2.01576 13.4756C2.08114 16.5411 2.11382 18.0739 3.24495 19.2093C4.37608 20.3448 5.95033 20.3843 9.09883 20.4634C11.0393 20.5122 12.9607 20.5122 14.9012 20.4634C18.0497 20.3843 19.6239 20.3448 20.755 19.2093C21.8862 18.0739 21.9189 16.5411 21.9842 13.4756C22.0053 12.4899 22.0053 11.51 21.9842 10.5244C21.9189 7.45883 21.8862 5.92606 20.755 4.79063C19.6239 3.6552 18.0497 3.61565 14.9012 3.53654C12.9607 3.48778 11.0393 3.48778 9.09882 3.53653C5.95033 3.61563 4.37608 3.65518 3.24495 4.79062C2.11382 5.92605 2.08113 7.45882 2.01576 10.5243C1.99474 11.51 1.99474 12.4899 2.01576 13.4756Z" stroke="currentColor" strokeWidth={2} strokeLinejoin="round" />
    </svg>
  );
};

const SeoIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M10.5882 11.0284C8.72913 11.0284 7.22204 12.5277 7.22204 14.3772C7.22204 15.3022 7.59775 16.1381 8.20797 16.7451C8.8182 17.3522 9.6584 17.726 10.5882 17.726C12.4473 17.726 13.9544 16.2267 13.9544 14.3772C13.9544 12.5277 12.4473 11.0284 10.5882 11.0284ZM5.2675 14.3772C5.2675 11.4538 7.64966 9.08398 10.5882 9.08398C13.5268 9.08398 15.9089 11.4538 15.9089 14.3772C15.9089 17.3006 13.5268 19.6704 10.5882 19.6704C9.47247 19.6704 8.43604 19.328 7.58068 18.7441L5.84995 20.4659C5.4683 20.8456 4.84953 20.8456 4.46788 20.4659C4.08623 20.0862 4.08623 19.4706 4.46788 19.091L6.19861 17.3692C5.61167 16.5182 5.2675 15.4872 5.2675 14.3772Z" fill="currentColor" />
      <path fillRule="evenodd" clipRule="evenodd" d="M1.25 11.4772C1.25 6.92885 4.97374 3.25 9.55682 3.25H14.4432C19.0263 3.25 22.75 6.92885 22.75 11.4772C22.75 15.064 20.4339 18.1089 17.2106 19.2366C16.7014 19.4147 16.1435 19.1485 15.9644 18.642C15.7854 18.1355 16.053 17.5804 16.5621 17.4023C19.0324 16.5381 20.7955 14.2082 20.7955 11.4772C20.7955 8.01196 17.9561 5.19444 14.4432 5.19444H9.55682C6.04391 5.19444 3.20455 8.01196 3.20455 11.4772C3.20455 12.6203 3.51226 13.6894 4.04985 14.6112C4.32071 15.0757 4.16183 15.6706 3.69498 15.9401C3.22813 16.2095 2.6301 16.0515 2.35924 15.587C1.65363 14.3771 1.25 12.9725 1.25 11.4772Z" fill="currentColor" />
    </svg>
  );
};


export const routes: Map<RouteGroup, Route[]> = new Map([
  [
    {
      id: "default",
      name: "Genel",
      type: "group"
    },
    [
      {
        id: "dashboard",
        name: "Ana Sayfa",
        href: "/dashboard",
        segment: "/dashboard",
        icon: HomeIcon,
        children: [],
        type: "route"
      },
      {
        id: "messages",
        name: "İleti Kutusu",
        href: "/messages",
        segment: "/messages",
        icon: MailIcon,
        children: [],
        type: "route"
      },
    ]],
  [
    {
      id: "site-content",
      name: "Site İçeriği",
      type: "group"
    },
    [

      {
        id: "content-groups",
        name: "İçerik Yönetimi",
        href: "/site-content/content-groups",
        segment: "/content-groups",
        type: "route",
        icon: ContentGroupsIcon,
        children: [],
        type: "route"
      },
      {
        id: "blog",
        name: "Blog Yönetimi",
        href: "/site-content/blog",
        segment: "/blog",
        type: "route",
        icon: BlogIcon,
        children: [],
        type: "route"
      },
 

    ]],
    [
      {
        id: "all-assets",
        name: "Varlıklar",
        type: "group",
      },
      [
        {
          id: "asset-catalog",
          name: "Varlıklar",
          href: "/site-content/asset-catalog",
          segment: "/asset-catalog",
          icon: MediaIcon,
          children: [],
          type: "route",
        },
        {
          id: "string-catalog",
          name: "Dize Kataloğu",
          href: "/site-content/string-catalog",
          segment: "/string-catalog",
          type: "route",
          icon: StringCatalogIcon,
          children: [],
          type: "route"
        },
      ]


    ],
  [
    {
      id: "settings",
      name: "Ayarlar",
      type: "group"
    },
    [
      {
        id: "seo",
        name: "Arama Motoru Optimizasyonu (SEO)",
        href: "/site-content/seo",
        segment: "/seo",
        icon: SeoIcon,
        children: [],
        type: "route",
      },
      {
        id: "mail",
        name: "Mail Konfigürasyonu",
        href: "/site-content/mail",
        segment: "/mail",
        icon: MailSettingsIcon,
        children: [],
        type: "route",
      }
    ]
  ]
]);
