import{c as s,u as r,j as e,C as a,m as n}from"./index-ZkN_EC_U.js";import{S as l}from"./SectionHeader-AJze9WIx.js";import{G as d}from"./GlassCard-CRR7KiWD.js";import{A as p}from"./arrow-right-CPOsPf7Q.js";/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m=[["path",{d:"m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z",key:"9ktpf1"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]],h=s("Compass",m);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x=[["circle",{cx:"13.5",cy:"6.5",r:".5",fill:"currentColor",key:"1okk4w"}],["circle",{cx:"17.5",cy:"10.5",r:".5",fill:"currentColor",key:"f64h9f"}],["circle",{cx:"8.5",cy:"7.5",r:".5",fill:"currentColor",key:"fotxhn"}],["circle",{cx:"6.5",cy:"12.5",r:".5",fill:"currentColor",key:"qy21gx"}],["path",{d:"M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z",key:"12rzf8"}]],u=s("Palette",x);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=[["path",{d:"M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z",key:"m3kijz"}],["path",{d:"m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z",key:"1fmvmk"}],["path",{d:"M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0",key:"1f8sc4"}],["path",{d:"M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5",key:"qeys4"}]],g=s("Rocket",y);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k=[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]],f=s("Search",k);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v=[["path",{d:"M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5c-1.4 0-2.5-1.1-2.5-2.5V2",key:"125lnx"}],["path",{d:"M8.5 2h7",key:"csnxdl"}],["path",{d:"M14.5 16h-5",key:"1ox875"}]],C=s("TestTube",v),o=[{step:"01",title:"Discovery",icon:f,desc:"Deep dive into product requirements, user personas, brand aesthetics, and technical constraints."},{step:"02",title:"Planning",icon:h,desc:"Architecting system schemas, component taxonomies, API contracts, and performance budgets."},{step:"03",title:"UI Design",icon:u,desc:"Crafting Neumorphism & Glassmorphism design tokens, micro-interaction states, and dark mode palettes."},{step:"04",title:"Development",icon:a,desc:"Engineering modular React 19 SPAs with sub-second lazy loading and 60 FPS motion sequences."},{step:"05",title:"Testing",icon:C,desc:"Rigorous end-to-end testing, Core Web Vitals audits, cross-browser validation, and security scans."},{step:"06",title:"Deployment",icon:g,desc:"Continuous integration deployment to Cloudflare Edge / Vercel with automated cache invalidation."}],z=()=>{const{isDark:i}=r();return e.jsx("section",{className:"py-16 sm:py-24 relative overflow-hidden",children:e.jsxs("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10",children:[e.jsx(l,{badge:"Execution Blueprint",title:"The 6-Step Precision Development Process",subtitle:"How I transform concepts into production-grade digital products with zero friction."}),e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative",children:o.map((t,c)=>e.jsx(n.div,{initial:{opacity:0,y:20},whileInView:{opacity:1,y:0},viewport:{once:!0},transition:{duration:.4,delay:c*.1},children:e.jsxs(d,{neumorphic:!0,gradientBorder:!0,className:"p-6 space-y-4 h-full relative group",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("span",{className:"text-3xl font-black gradient-text",children:t.step}),e.jsx("div",{className:`p-3 rounded-2xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 ${i?"neu-pressed-dark text-[#7C5CFF]":"neu-pressed-light text-[#6C63FF]"}`,children:e.jsx(t.icon,{className:"w-6 h-6"})})]}),e.jsx("h3",{className:"text-xl font-extrabold text-[#1B2430] dark:text-[#F8FAFC]",children:t.title}),e.jsx("p",{className:"text-sm text-[#667085] dark:text-[#CBD5E1] leading-relaxed",children:t.desc}),c<o.length-1&&e.jsx("div",{className:"hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-20 text-[#6C63FF] opacity-30",children:e.jsx(p,{className:"w-5 h-5"})})]})},t.step))})]})})};export{z as P};
