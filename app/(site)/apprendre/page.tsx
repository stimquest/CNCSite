import Link from 'next/link';
import { client, queries } from '@/lib/sanity';
import { DicoParents } from '@/components/DicoParents';
import { GamesSlideshow } from '@/components/GamesSlideshow';

export const metadata = {
  title: 'Apprendre en s’amusant — CNC Coutainville',
  description: 'Le dictionnaire des parents et les jeux nautiques du CNC : découvrir le vocabulaire de la voile, les allures et les priorités en mer.',
};
export const revalidate = 60;

export default async function ApprendrePage() {
  const words = await client.fetch(queries.dicoWords).catch(() => []);
  return <main className="bg-slate-50 pb-16 pt-28 md:pt-36">
    <header className="mx-auto max-w-400 px-5 md:px-6">
      <Link href="/ecole-voile" className="text-sm font-bold text-turquoise">← L’école de voile</Link>
      <h1 className="mt-6 text-3xl md:text-5xl font-black uppercase italic tracking-tight text-abysse">Apprendre en s’amusant</h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600">Comprendre les mots des moussaillons, essayer les allures et découvrir les règles de priorité : de quoi prolonger l’apprentissage en famille.</p>
      <nav aria-label="Les activités pédagogiques" className="mt-6 flex flex-wrap gap-3">
        <a href="#dico-parents" className="rounded-xl bg-abysse px-5 py-3 text-sm font-bold text-white">Le dico des parents</a>
        <a href="#jeux" className="rounded-xl border border-abysse/20 px-5 py-3 text-sm font-bold text-abysse">Les jeux nautiques</a>
      </nav>
    </header>
    <section id="dico-parents" className="mx-auto max-w-400 scroll-mt-24 px-5 py-12 md:px-6 md:py-16">
      {words.length ? <DicoParents dicoWords={words} /> : <p className="rounded-2xl bg-white p-6 text-slate-600">Le dictionnaire est momentanément indisponible. Les jeux restent accessibles ci-dessous.</p>}
    </section>
    <section id="jeux" className="scroll-mt-24 bg-abysse px-5 py-12 md:px-6 md:py-16">
      <div className="mx-auto max-w-400"><GamesSlideshow /></div>
    </section>
  </main>;
}
