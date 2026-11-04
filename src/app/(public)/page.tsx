import { Sparkles, Calendar, Scissors, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <main className="min-h-screen p-4 md:p-8 max-w-4xl mx-auto flex flex-col gap-6">
      <header className="flex flex-col gap-2 pt-6">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-teal-700 bg-teal-50 border-teal-200">
            <Sparkles className="w-3.5 h-3.5 mr-1 text-teal-600" />
            Pérola MVP
          </Badge>
          <Badge variant="outline" className="text-amber-700 bg-amber-50 border-amber-200">
            Cabo Verde (CVE)
          </Badge>
        </div>
        <h1 className="text-display text-slate-900">
          Beleza & Bem-Estar <span className="text-teal-600">sem atrito</span>.
        </h1>
        <p className="text-body-lg text-slate-600 max-w-xl">
          Descobre os melhores salões e especialistas em Cabo Verde, agenda serviços em segundos e gere o teu salão com facilidade.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="rounded-2xl border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-2">
              <Calendar className="w-5 h-5" />
            </div>
            <CardTitle className="text-h3">Agendamento Fácil</CardTitle>
            <CardDescription className="text-slate-500">
              Escolhe o dia e horário sem telefonemas ou confirmações lentas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Explorar Serviços</Button>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2">
              <Scissors className="w-5 h-5" />
            </div>
            <CardTitle className="text-h3">Para Salões & Spas</CardTitle>
            <CardDescription className="text-slate-500">
              Gestão de escalas, catálogo e marcações multi-tenant para a tua equipa.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="secondary" className="w-full">Cadastrar Salão</Button>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-2">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <CardTitle className="text-h3">Confiança Local</CardTitle>
            <CardDescription className="text-slate-500">
              Preços claros em Escudos (CVE), fuso horário de Cabo Verde e suporte direto.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">Saber Mais</Button>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

