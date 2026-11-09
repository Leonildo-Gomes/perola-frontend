"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, ArrowLeft, CalendarX2, Check, Loader2, SearchX, UserRound, Users } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useBookingTarget } from "../hooks/use-booking";
import { useInvalidateSlots, useNextAvailableDate, useSlots } from "../hooks/use-slots";
import { createAppointment } from "../api/booking.api";
import { isSlotConflictError } from "@/lib/api/errors";
import { formatKeyLong, formatTime, upcomingDateKeys } from "@/lib/datetime";
import { type BookingNotesValues, NOTES_MAX_LENGTH, bookingNotesSchema } from "../schemas/booking.schema";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { ANY_EMPLOYEE, type BookingTarget } from "../types/booking.types";
import { BookingSummary } from "./booking-summary";
import { ConflictAlert } from "./conflict-alert";
import { DateCarousel } from "./date-carousel";
import { SlotPicker } from "./slot-picker";

const DAYS_AHEAD = 14;
const STEP_TITLES = ["Escolha o profissional", "Escolha a data e a hora", "Reveja e confirme"] as const;
type Step = 1 | 2 | 3;

interface Props {
  serviceId: string;
}

/** Loads service + business + team, then renders the wizard. */
export function BookingWizardContainer({ serviceId }: Props) {
  const businessIdHint = useSearchParams().get("businessId");
  const target = useBookingTarget(serviceId, businessIdHint);

  if (target.isPending) return <WizardSkeleton />;
  if (target.isError) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-10">
        <EmptyState icon={AlertTriangle} tone="error" title="Não foi possível carregar o serviço" description="Verifique a sua ligação e tente novamente.">
          <Button type="button" variant="brand" onClick={() => void target.refetch()}>
            Tentar novamente
          </Button>
        </EmptyState>
      </div>
    );
  }
  if (!target.data) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-10">
        <EmptyState icon={SearchX} title="Serviço indisponível" description="Este serviço já não está disponível para marcação.">
          <Button asChild variant="brand">
            <Link href="/explore">Explorar serviços</Link>
          </Button>
        </EmptyState>
      </div>
    );
  }
  return <BookingWizard serviceId={serviceId} target={target.data} />;
}

function WizardSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-4 px-4 py-6" aria-busy="true" aria-label="A carregar">
      <Skeleton className="h-8 w-2/3" />
      <Skeleton className="h-2 w-full" />
      <Skeleton className="h-20 w-full rounded-2xl" />
      <Skeleton className="h-20 w-full rounded-2xl" />
    </div>
  );
}

function BookingWizard({ serviceId, target }: { serviceId: string; target: BookingTarget }) {
  const { business, service, employees } = target;
  const router = useRouter();
  const params = useSearchParams();
  const queryClient = useQueryClient();
  const invalidateSlots = useInvalidateSlots();
  const dates = useMemo(() => upcomingDateKeys(DAYS_AHEAD), []);

  // Initial state, optionally restored from the URL (returning from login).
  const initial = useMemo(() => {
    const emp = params.get("employee");
    const date = params.get("date");
    const start = params.get("start");
    const choice = emp && (emp === ANY_EMPLOYEE || employees.some((e) => e.id === emp)) ? emp : ANY_EMPLOYEE;
    const validDate = date && dates.includes(date) ? date : null;
    const validStart = validDate && start && !Number.isNaN(Date.parse(start)) ? start : null;
    return { choice, date: validDate ?? dates[0], start: validStart, step: (validStart ? 3 : 1) as Step };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [step, setStep] = useState<Step>(initial.step);
  const [employeeChoice, setEmployeeChoice] = useState<string>(initial.choice);
  const [date, setDate] = useState(initial.date);
  const [startTime, setStartTime] = useState<string | null>(initial.start);
  /** Start time that was lost to another customer (409 or detected on refetch). */
  const [conflictStart, setConflictStart] = useState<string | null>(null);
  const conflictRef = useRef<HTMLDivElement>(null);
  const mutationPendingRef = useRef(false);

  const form = useForm<BookingNotesValues>({
    resolver: zodResolver(bookingNotesSchema),
    defaultValues: { notes: params.get("notes") ?? "" },
  });
  const notes = form.watch("notes") ?? "";

  const employeeIds = useMemo(
    () => (employeeChoice === ANY_EMPLOYEE ? employees.map((e) => e.id) : [employeeChoice]),
    [employeeChoice, employees],
  );
  const slotsQuery = useSlots({
    businessId: business.id,
    serviceId,
    employeeIds,
    date,
    enabled: step >= 2 && employeeIds.length > 0,
  });
  const { slots } = slotsQuery;
  const selectedSlot = slots.find((s) => s.startTime === startTime) ?? null;
  const slotsSettled = step >= 2 && !slotsQuery.isLoading && !slotsQuery.isFetching && !slotsQuery.isError;

  const nextAvailable = useNextAvailableDate({
    businessId: business.id,
    serviceId,
    employeeIds,
    dates,
    from: date,
    enabled: slotsSettled && slots.length === 0,
  });

  // The chosen slot vanished on a refetch (taken by someone else): same recovery as a 409, nothing is reset.
  useEffect(() => {
    if (startTime && slotsSettled && !selectedSlot && !mutationPendingRef.current) {
      setConflictStart(startTime);
      setStartTime(null);
    }
  }, [startTime, slotsSettled, selectedSlot]);

  useEffect(() => {
    if (conflictStart) conflictRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [conflictStart]);

  const alternatives = useMemo(() => {
    if (!conflictStart) return [];
    const ref = new Date(conflictStart).getTime();
    return slots
      .filter((s) => s.startTime !== conflictStart)
      .sort((a, b) => Math.abs(new Date(a.startTime).getTime() - ref) - Math.abs(new Date(b.startTime).getTime() - ref))
      .slice(0, 6)
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }, [conflictStart, slots]);

  const mutation = useMutation({
    mutationFn: createAppointment,
    onMutate: () => {
      mutationPendingRef.current = true;
    },
    onSettled: () => {
      mutationPendingRef.current = false;
    },
    onSuccess: (appointment) => {
      queryClient.setQueryData(["appointments", "detail", appointment.id], appointment);
      void invalidateSlots();
      void queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
      router.push(`/book/confirmed/${appointment.id}`);
    },
    onError: (error, vars) => {
      if (isSlotConflictError(error)) {
        // Keep professional, date and notes; only the lost slot is dropped. Refetch and suggest alternatives.
        setConflictStart(vars.startTime);
        setStartTime(null);
        setStep(3);
        void invalidateSlots();
        return;
      }
      toast.error(error instanceof Error ? error.message : "Não foi possível concluir a marcação. Tente novamente.");
    },
  });

  const employeeLabel = selectedSlot
    ? (employees.find((e) => e.id === selectedSlot.employeeId)?.displayName ?? "Profissional")
    : employeeChoice === ANY_EMPLOYEE
      ? "Qualquer profissional disponível"
      : (employees.find((e) => e.id === employeeChoice)?.displayName ?? "Profissional");

  const chooseEmployee = (id: string) => {
    if (id !== employeeChoice) {
      setEmployeeChoice(id);
      setStartTime(null);
      setConflictStart(null);
    }
  };
  const chooseDate = (d: string) => {
    setDate(d);
    setStartTime(null);
    setConflictStart(null);
  };
  const pickSlot = (start: string) => {
    setStartTime(start);
    setConflictStart(null);
  };

  const confirm = form.handleSubmit((values) => {
    if (!selectedSlot || mutation.isPending) return;
    if (!useAuthStore.getState().isAuthenticated) {
      const back = new URLSearchParams({ businessId: business.id, employee: employeeChoice, date, start: selectedSlot.startTime });
      if (values.notes) back.set("notes", values.notes);
      router.push(`/login?next=${encodeURIComponent(`/book/${serviceId}?${back}`)}`);
      return;
    }
    mutation.mutate({
      businessId: business.id,
      employeeId: selectedSlot.employeeId,
      serviceId,
      startTime: selectedSlot.startTime,
      notes: values.notes || undefined,
    });
  });

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const canContinue = step === 1 ? employeeIds.length > 0 : step === 2 ? Boolean(selectedSlot) : Boolean(selectedSlot);
  const back = () => (step > 1 ? setStep((step - 1) as Step) : router.back());
  const onPrimary = () => (step < 3 ? setStep((step + 1) as Step) : void confirm());

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 lg:grid lg:grid-cols-[1fr_360px] lg:gap-8">
      <div className="min-w-0">
        <button
          type="button"
          onClick={back}
          className="mb-3 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-perola-deep"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Voltar
        </button>
        <h1 className="text-2xl font-extrabold text-slate-900">Agendar {service.name}</h1>
        <p className="text-sm text-slate-500">{business.name}</p>

        <div className="mt-5" role="group" aria-label={`Passo ${step} de 3`}>
          <div className="flex items-center justify-between text-sm">
            <span className="font-bold text-perola-deep">Passo {step} de 3</span>
            <span className="text-slate-500">{STEP_TITLES[step - 1]}</span>
          </div>
          <div className="mt-2 flex gap-1.5" aria-hidden>
            {[1, 2, 3].map((n) => (
              <span key={n} className={cn("h-1.5 flex-1 rounded-full", n <= step ? "bg-perola-deep" : "bg-slate-200")} />
            ))}
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {step === 1 && (
            <div role="radiogroup" aria-label="Profissional" className="space-y-3">
              <EmployeeOption selected={employeeChoice === ANY_EMPLOYEE} onSelect={() => chooseEmployee(ANY_EMPLOYEE)} name="Qualquer profissional disponível" hint="Atribuímos automaticamente o primeiro horário livre" icon={<Users className="h-5 w-5" aria-hidden />} />
              {employees.map((e) => (
                <EmployeeOption
                  key={e.id}
                  selected={employeeChoice === e.id}
                  onSelect={() => chooseEmployee(e.id)}
                  name={e.displayName}
                  icon={<span className="font-accent text-sm font-bold">{initials(e.displayName)}</span>}
                />
              ))}
              {employees.length === 0 && (
                <EmptyState icon={UserRound} title="Sem profissionais disponíveis" description="Este salão ainda não tem profissionais com agenda aberta." />
              )}
            </div>
          )}

          {step === 2 && (
            <>
              <DateCarousel dates={dates} selected={date} onSelect={chooseDate} />
              <div aria-live="polite">
                {slotsQuery.isError ? (
                  <EmptyState icon={AlertTriangle} tone="error" title="Não foi possível carregar os horários" description="Verifique a sua ligação e tente novamente.">
                    <Button type="button" variant="brand" onClick={() => void slotsQuery.refetch()}>
                      Tentar novamente
                    </Button>
                  </EmptyState>
                ) : slotsSettled && slots.length === 0 ? (
                  <EmptyState icon={CalendarX2} title="Não existem horários vagos para este dia.">
                    {nextAvailable.isFetching ? (
                      <p className="flex items-center gap-2 text-sm text-slate-500">
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />A procurar a próxima data…
                      </p>
                    ) : nextAvailable.data ? (
                      <Button type="button" variant="brand" onClick={() => chooseDate(nextAvailable.data as string)}>
                        Próxima data disponível: <span className="ml-1 capitalize">{formatKeyLong(nextAvailable.data)}</span>
                      </Button>
                    ) : (
                      <p className="text-sm text-slate-500">Sem disponibilidade nos próximos {DAYS_AHEAD} dias.</p>
                    )}
                  </EmptyState>
                ) : (
                  <div className="space-y-3">
                    {slotsSettled && slots.length > 0 && slots.length <= 3 && (
                      <p className="inline-flex rounded-lg bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800">
                        Apenas {slots.length} {slots.length === 1 ? "vaga restante" : "vagas restantes"}
                      </p>
                    )}
                    <SlotPicker slots={slots} isLoading={slotsQuery.isLoading} selectedSlot={startTime} onSelectSlot={pickSlot} />
                  </div>
                )}
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div ref={conflictRef}>
                {conflictStart && (
                  <ConflictAlert
                    conflictedStart={conflictStart}
                    alternatives={alternatives}
                    isLoading={slotsQuery.isFetching && alternatives.length === 0}
                    onPick={pickSlot}
                    onChangeDate={() => setStep(2)}
                  />
                )}
              </div>
              <BookingSummary className="lg:hidden" business={business} service={service} employeeLabel={employeeLabel} startTime={selectedSlot?.startTime ?? null} />
              <div>
                <label htmlFor="booking-notes" className="mb-1.5 block text-sm font-semibold text-slate-900">
                  Notas ou observações para o profissional <span className="font-normal text-slate-500">(opcional)</span>
                </label>
                <textarea
                  id="booking-notes"
                  rows={3}
                  maxLength={NOTES_MAX_LENGTH + 50}
                  aria-invalid={Boolean(form.formState.errors.notes)}
                  aria-describedby="booking-notes-help"
                  placeholder="Ex.: preferência por corte desfiado nas pontas"
                  className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-teal-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
                  {...form.register("notes")}
                />
                <div id="booking-notes-help" className="mt-1 flex justify-between text-xs">
                  <span className="text-rose-600">{form.formState.errors.notes?.message}</span>
                  <span className="text-slate-500">{notes.length}/{NOTES_MAX_LENGTH}</span>
                </div>
              </div>
              <p className="rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-600">
                Pode cancelar ou reagendar a marcação em <strong>Minhas Marcações</strong>. Avise o salão com antecedência se não puder comparecer.
              </p>
              {!isAuthenticated && (
                <p className="rounded-xl bg-teal-50 px-4 py-3 text-sm text-teal-900">
                  Vai precisar de iniciar sessão para confirmar. Mantemos a sua escolha.
                </p>
              )}
            </>
          )}
        </div>

        <div className="sticky bottom-16 z-30 -mx-4 mt-8 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur md:bottom-0">
          <Button
            type="button"
            variant="brand"
            size="lg"
            className="w-full"
            disabled={!canContinue || mutation.isPending}
            onClick={onPrimary}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden />A reservar o seu horário...
              </>
            ) : step === 3 ? (
              <>
                <Check className="mr-2 h-5 w-5" aria-hidden />
                Confirmar Agendamento
              </>
            ) : step === 2 && selectedSlot ? (
              `Continuar · ${formatTime(selectedSlot.startTime)}`
            ) : (
              "Continuar"
            )}
          </Button>
        </div>
      </div>

      <aside className="hidden lg:block">
        <BookingSummary className="sticky top-24" business={business} service={service} employeeLabel={employeeLabel} startTime={selectedSlot?.startTime ?? null} />
      </aside>
    </div>
  );
}

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

function EmployeeOption({
  selected,
  onSelect,
  name,
  hint,
  icon,
}: {
  selected: boolean;
  onSelect: () => void;
  name: string;
  hint?: string;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        "flex min-h-[64px] w-full items-center gap-3 rounded-2xl border bg-white p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2",
        selected ? "border-perola-deep bg-teal-50 ring-1 ring-perola-deep" : "border-slate-200 hover:border-perola-deep",
      )}
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-perola-mint text-perola-deep">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-semibold text-slate-900">{name}</span>
        {hint && <span className="block text-xs text-slate-500">{hint}</span>}
      </span>
      {selected && <Check className="h-5 w-5 shrink-0 text-perola-deep" aria-hidden />}
    </button>
  );
}
