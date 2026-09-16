import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const SAMPLE_CARDS = ["Aluguel", "Mercado", "Transporte", "Lazer"] as const;

function prefersReduced(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function MotionDemo() {
  const reduce = useReducedMotion();
  const [key, setKey] = useState(0);

  return (
    <section className="flex w-full flex-col gap-space-16 rounded-shape-20 border border-neutral-300 bg-surface p-space-24">
      <header className="flex flex-wrap items-center justify-between gap-space-12">
        <div>
          <p className="text-label-x-small font-semibold tracking-[0.3px] text-primary">
            Biblioteca Motion
          </p>
          <h2 className="text-heading-x-small font-bold text-neutral-1100">
            Declarativa (React-first)
          </h2>
        </div>
        <button
          type="button"
          onClick={() => setKey((value) => value + 1)}
          className="min-h-11 rounded-shape-100 bg-neutral-1100 px-space-16 text-label-medium font-semibold text-surface"
        >
          Replay
        </button>
      </header>

      <motion.div
        key={key}
        className="grid grid-cols-2 gap-space-12 md:grid-cols-4"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: reduce ? 0 : 0.08,
            },
          },
        }}
      >
        {SAMPLE_CARDS.map((label) => (
          <motion.article
            key={label}
            variants={{
              hidden: { opacity: 0, y: reduce ? 0 : 16, scale: reduce ? 1 : 0.94 },
              show: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { type: "spring", stiffness: 380, damping: 28 },
              },
            }}
            whileHover={
              reduce
                ? undefined
                : { y: -4, borderColor: "var(--color-primary)" }
            }
            className="rounded-shape-20 border border-neutral-300 bg-surface p-space-16 text-center"
          >
            <p className="text-paragraph-small text-neutral-1100">{label}</p>
            <p className="mt-space-4 text-heading-x-small font-bold text-neutral-1100">
              R$ —
            </p>
          </motion.article>
        ))}
      </motion.div>

      <p className="text-paragraph-x-small text-neutral-600">
        Bom para: stagger de listas, hover/spring, layout animations, modais e
        rotas. Integra natural com React.
      </p>
    </section>
  );
}

function GsapEntranceDemo() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [runId, setRunId] = useState(0);

  useGSAP(
    () => {
      if (prefersReduced()) {
        gsap.set(".lab-gsap-card", { opacity: 1, y: 0, scale: 1 });
        return;
      }

      gsap.fromTo(
        ".lab-gsap-card",
        { opacity: 0, y: 24, scale: 0.92 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.55,
          stagger: 0.1,
          ease: "power3.out",
        },
      );
    },
    { scope: rootRef, dependencies: [runId] },
  );

  return (
    <section
      ref={rootRef}
      className="flex w-full flex-col gap-space-16 rounded-shape-20 border border-neutral-300 bg-surface p-space-24"
    >
      <header className="flex flex-wrap items-center justify-between gap-space-12">
        <div>
          <p className="text-label-x-small font-semibold tracking-[0.3px] text-red-600">
            Biblioteca GSAP
          </p>
          <h2 className="text-heading-x-small font-bold text-neutral-1100">
            Timeline + controle fino
          </h2>
        </div>
        <button
          type="button"
          onClick={() => setRunId((value) => value + 1)}
          className="min-h-11 rounded-shape-100 bg-neutral-1100 px-space-16 text-label-medium font-semibold text-surface"
        >
          Replay
        </button>
      </header>

      <div className="grid grid-cols-2 gap-space-12 md:grid-cols-4">
        {SAMPLE_CARDS.map((label) => (
          <article
            key={label}
            className="lab-gsap-card rounded-shape-20 border border-neutral-300 bg-surface p-space-16 text-center opacity-0"
          >
            <p className="text-paragraph-small text-neutral-1100">{label}</p>
            <p className="mt-space-4 text-heading-x-small font-bold text-neutral-1100">
              R$ —
            </p>
          </article>
        ))}
      </div>

      <p className="text-paragraph-x-small text-neutral-600">
        Bom para: timelines complexas, SVG, sequências longas e performance em
        animações imperativas.
      </p>
    </section>
  );
}

function GsapScrollDemo() {
  const sectionRef = useRef<HTMLElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!boxRef.current || prefersReduced()) {
        return;
      }

      gsap.fromTo(
        boxRef.current,
        { xPercent: -20, rotate: -4, opacity: 0.4 },
        {
          xPercent: 20,
          rotate: 4,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "bottom 20%",
            scrub: true,
          },
        },
      );
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="flex min-h-[70vh] w-full flex-col justify-center gap-space-24 rounded-shape-20 border border-dashed border-neutral-400 bg-neutral-100 p-space-24"
    >
      <div>
        <p className="text-label-x-small font-semibold tracking-[0.3px] text-red-600">
          GSAP ScrollTrigger
        </p>
        <h2 className="text-heading-x-small font-bold text-neutral-1100">
          Scrub ligado ao scroll
        </h2>
        <p className="mt-space-8 max-w-xl text-paragraph-small text-neutral-600">
          Role a página: o card se move e gira conforme o progresso do scroll.
          Esse tipo de efeito raramente cabe no dashboard — brilha em landing /
          storytelling.
        </p>
      </div>

      <div
        ref={boxRef}
        className="mx-auto flex w-full max-w-sm flex-col gap-space-8 rounded-shape-20 border border-neutral-300 bg-surface p-space-24 shadow-sm"
      >
        <p className="text-label-medium font-semibold text-neutral-1100">
          Card com scrub
        </p>
        <p className="text-paragraph-small text-neutral-600">
          primary → secondary · power of scroll
        </p>
        <div className="h-2 overflow-hidden rounded-shape-100 bg-neutral-200">
          <div className="h-full w-2/3 rounded-shape-100 bg-primary" />
        </div>
      </div>
    </section>
  );
}

export function MotionLabPage() {
  return (
    <div className="flex w-full flex-col gap-space-24 pb-space-32">
      <header className="flex w-full flex-col gap-space-12 rounded-shape-20 border border-neutral-300 bg-surface p-space-24">
        <p className="text-label-x-small font-semibold tracking-[0.3px] text-neutral-600">
          Lab isolado · fora da sequência de prompts
        </p>
        <h1 className="text-heading-medium font-bold text-neutral-1100">
          Motion × GSAP
        </h1>
        <p className="max-w-2xl text-paragraph-small text-neutral-600">
          Compare as duas libs no mesmo app. O dashboard Mycash+ continua
          intacto; o Prompt 21 (animações do produto) ainda não usa isso.
        </p>
        <Link
          to="/"
          className="inline-flex min-h-11 w-fit items-center rounded-shape-100 border border-neutral-1100 px-space-16 text-label-medium font-semibold text-neutral-1100"
        >
          ← Voltar à Home
        </Link>
      </header>

      <div className="grid w-full grid-cols-1 gap-space-24 lg:grid-cols-2">
        <MotionDemo />
        <GsapEntranceDemo />
      </div>

      <GsapScrollDemo />

      <section className="rounded-shape-20 border border-neutral-300 bg-surface p-space-24">
        <h2 className="mb-space-12 text-heading-x-small font-bold text-neutral-1100">
          Quando usar o quê no Mycash+
        </h2>
        <ul className="flex list-disc flex-col gap-space-8 pl-space-24 text-paragraph-small text-neutral-600">
          <li>
            <strong className="text-neutral-1100">Motion</strong> — cards,
            donuts, modais, fade de rota, hover (encaixa no Prompt 21).
          </li>
          <li>
            <strong className="text-neutral-1100">GSAP core</strong> — timelines
            longas, SVG complexo, draw de gráfico.
          </li>
          <li>
            <strong className="text-neutral-1100">ScrollTrigger</strong> —
            landing / marketing; pouco uso na Home financeira.
          </li>
        </ul>
      </section>
    </div>
  );
}
