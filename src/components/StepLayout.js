import { Flex, Progress, Paper, Stack } from "@mantine/core";

export default function StepLayout({ children, step }) {
  const stepOrder = ["intro", "task1", "halfway", "task2", "finish", "done"];
  const currentIndex = stepOrder.indexOf(step);

  return (
    <Flex h="100%" w="100%" align="center" justify="center" p="md">
      <Paper
        w={{ base: "100%", sm: "80%", md: "60%", lg: "50%" }}
        maw={700}
        p={{ base: "lg", sm: "xl" }}
        radius="md"
        shadow="sm"
      >
        {step !== "intro" && (
          <Progress
            value={(currentIndex / (stepOrder.length - 1)) * 100}
            mb={30}
            size="sm"
            radius="xl"
          />
        )}
        <Stack align="center" gap="md">
          {children}
        </Stack>
      </Paper>
    </Flex>
  );
}