import { useState } from "react";
import { Radio, Stack, Button, Flex, Text } from "@mantine/core";

const Need = ({onSubmit}) => {

    const [need, setNeed] = useState('');

    function handleSubmit(e) {
        e.preventDefault();
        onSubmit({ need });
    }

    return (
        <form onSubmit={handleSubmit}>
            <Flex align="center" direction="column" maw={500} mx="auto" px={16}>
                <Radio.Group
                    value={need}
                    onChange={setNeed}
                    required
                    mb="md"
                >
                <Stack gap={4} mt="xs">
                    {['Ja, dieses Problem kenne ich.', 'Nein, dieses Problem hatte ich noch nicht.', 'Ich verstehe die Frage nicht.'].map((option) => (
                        <Radio key={option} value={option} label={option} />
                    ))}
                </Stack>
                </Radio.Group>
                {need == '' && (
                    <Text c="blue" ta="center" fz={{ base: "sm", sm: "md" }}>
                        Bitte beantworten Sie die Frage, um fortzufahren.
                    </Text>
                )}
                <Button disabled={need == '' ? true : false} type="submit" w="70%" mt={20}>Frage beantworten</Button>
            </Flex>
        </form>
    );
}
 
export default Need;