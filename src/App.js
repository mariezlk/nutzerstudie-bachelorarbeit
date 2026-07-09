import { Button, Title, Text, Checkbox, Loader } from '@mantine/core';
import './App.css';
import { useRef, useState } from 'react';
import StepLayout from './components/StepLayout';
import { useMediaQuery } from '@mantine/hooks';
import { submitResults } from './utils/submitResults';
import SearchTask from './components/SearchTask';
import SubjectiveAssessment from './components/SubjectiveAssessment';

function App() {

  const [checkedBox, setCheckedBox] = useState(false);
  const [verificationNeeded, setVerificationNeeded] = useState(false);
  const [step, setStep] = useState("intro");
  const [task1Selected, setTask1Selected] = useState(false);
  const [task2Selected, setTask2Selected] = useState(false);
  const isMobile = useMediaQuery('(max-width: 48em)');

  const ORIGIN = { lat: 52.51198625339564, lon: 13.315920121934308 }; // Koordinaten der Hochschule

  const participantId = useRef(generateParticipantId()).current;
  const taskResultsRef = useRef([]); // sammelt Ergebnisse aus Aufgabe 1 + 2

  function generateParticipantId() {
    return `p_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  }

  // Zufällige Zuteilung der Reihenfolge – EINMALIG pro Teilnehmer,
  // bleibt über den gesamten Durchlauf stabil (useState statt Neuberechnung).
  const [conditionOrder] = useState(() =>
    Math.random() < 0.5
      ? ['popularity', 'distance']
      : ['distance', 'popularity']
  );

  function handleTaskComplete(result) {
    taskResultsRef.current.push({ ...result, participantId });

    if (result.taskLabel === 'task_1') {
      setTask1Selected(true);
    }
    if (result.taskLabel === 'task_2') {
      setTask2Selected(true);
    }
  }

  async function handleQuestionnaireSubmit(questionnaireData) {
    const payload = {
      participantId,
      conditionOrder,
      taskResults: taskResultsRef.current,
      questionnaire: questionnaireData,
      submittedAt: new Date().toISOString(),
    };
    await submitResults({ payload, setStep });
    setStep("done");
  }

  if (step === "intro") {
  return (
    <StepLayout step={step}>
      <Title ta="center" order={2} fz={{ base: "h3", sm: "h1" }}>
        Nutzerstudie zur Zieleingabe im Rahmen meiner Bachelorarbeit
      </Title>
      <Text ta="center">
        Vielen Dank, dass Sie teilnehmen! Die Studie dauert etwa 3–5 Minuten.
      </Text>
      <Title ta="center" order={3}>Ihre Aufgabe:</Title>
      <Text ta="center">
        Stellen Sie sich vor, Sie stehen an der FOM Hochschule für Ökonomie
        und Management in Berlin und möchten nach Hause. Geben Sie im
        Eingabefeld Ihre <strong>Heimatadresse</strong> ein und wählen Sie sie aus der
        Vorschlagsliste aus, sobald sie erscheint. Sie machen diese Aufgabe
        <strong> zweimal hintereinander</strong>. Am Ende bitten wir Sie um eine kurze
        Einschätzung.
      </Text>
      <Text ta="center">
        Im Hintergrund wird dabei die Zeit gemessen, die Sie zur Eingabe
        benötigen.
      </Text>
      <Checkbox
        checked={checkedBox}
        onChange={(event) => setCheckedBox(event.currentTarget.checked)}
        label="Ich bin mit der Verarbeitung meiner Eingaben zu Studienzwecken einverstanden."
      />
      {verificationNeeded && (
        <Text c="blue">
          Zum Start der Studie müssen Sie der Verarbeitung Ihrer Eingaben zustimmen!
        </Text>
      )}
      <Button
        fullWidth={isMobile}
        onClick={() => (!checkedBox ? setVerificationNeeded(true) : setStep("task1"))}
      >
        Studie starten
      </Button>
    </StepLayout>
  );
}
if (step === "task1") {
  return (
    <StepLayout step={step}>
      <Title ta="center" order={2}>Aufgabe 1</Title>
      <SearchTask
        origin={ORIGIN}
        condition={conditionOrder[0]}
        taskLabel="task_1"
        onComplete={handleTaskComplete}
      />
      {!task1Selected && (
        <Text c="blue" ta="center">
          Wählen Sie Ihre Heimatadresse aus, um fortzufahren.
        </Text>
      )}
      <Button disabled={task1Selected ? false : true} onClick={() => setStep("halfway")}>
        Aufgabe 1 abschließen
      </Button>
    </StepLayout>
  );
}
  if (step === "halfway") {
    return (
      <StepLayout step={step}>
        <Title ta="center" order={3}>Sie haben Aufgabe 1 bereits abgschlossen, nun folgt Frage 2 ✅</Title>
        <Button onClick={() => setStep("task2")}>
          Mit Aufgabe 2 fortfahren
        </Button>
      </StepLayout>
    );
  }
  if (step === "task2") {
    return (
      <StepLayout step={step}>
        <Title ta="center" order={2}>Aufgabe 2</Title>
        <SearchTask
          origin={ORIGIN}
          condition={conditionOrder[1]}
          taskLabel="task_2"
          onComplete={handleTaskComplete}
        />
        {!task2Selected && (
          <Text c="blue" ta="center">
            Wählen Sie Ihre Heimatadresse aus, um fortzufahren.
          </Text>
        )}
        <Button disabled={task2Selected ? false : true} onClick={() => setStep("finish")}>
          Aufgabe 2 abschließen
        </Button>
      </StepLayout>
    );
  }
  if (step === "finish") {
    return (
      <StepLayout step={step}>
          <Title ta="center" order={2} mb={20}>Abschließende Einschätzung</Title>
          <SubjectiveAssessment onSubmit={handleQuestionnaireSubmit}/>
      </StepLayout>
    );
  }
  if (step === "done") {
    return (
      <StepLayout step={step}>
        <Title ta="center">Herzlichen Dank für Ihre Teilnahme 💝</Title>
        <Text c="blue" ta="center">Sie können das Browserfenster nun schließen :)</Text>
      </StepLayout>
    );
  }
  if (step === "loading") {
    return (
      <StepLayout step={step}>
        <Loader color="blue" type="bars" />
        <Text c="blue" ta="center">Bitte warten Sie einen Moment, die Daten werden gespeichert.</Text>
      </StepLayout>
    )
  }
}

export default App;
