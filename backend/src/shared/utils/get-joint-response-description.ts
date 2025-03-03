export function getJointResponseDescription(responses: string[]): string {
  return responses.map((response) => `- ${response}`).join('\n');
}
