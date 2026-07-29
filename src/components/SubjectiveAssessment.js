import { useState } from "react";
import { Radio, Stack, Textarea, Button, Flex, Text } from "@mantine/core";

const SubjectiveAssessment = ({ onSubmit }) => {
    const [preferred, setPreferred] = useState('');
    const [comment, setComment] = useState('');

    function handleSubmit(e) {
        e.preventDefault();
        onSubmit({ preferred, comment });
    }

    return ( 
        <form onSubmit={handleSubmit}>
            <Flex align="center" direction="column" maw={500} mx="auto" px={16}>
                <Radio.Group
                    label="Welche Version fanden Sie hilfreicher?"
                    value={preferred}
                    onChange={setPreferred}
                    required
                    mb="md"
                >
                <Stack gap={4} mt="xs">
                    {['Version 1', 'Version 2', 'Kein Unterschied'].map((option) => (
                        <Radio key={option} value={option} label={option} />
                    ))}
                </Stack>
                </Radio.Group>

                {(preferred === 'Version 1' || preferred === 'Version 2') &&
                    <Textarea
                        label="Was hat Ihnen an der bevorzugten Version besonders geholfen?"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={4}
                        mb="md"
                    />
                }

                {preferred === '' && (
                    <Text c="blue" ta="center" fz={{ base: "sm", sm: "md" }}>
                        Wählen Sie eine der obigen Optionen aus, um fortzufahren.
                    </Text>
                )}

                <Button disabled={preferred !== '' ? false : true} type="submit" w="70%" mt={20}>Studie abschließen</Button>
            </Flex>
        </form>
    );
}
 
export default SubjectiveAssessment;