import {Prompt, Response} from "../types/message";

export const useMessage = () => {
    const handleSendMessage = async (message: Prompt) => {
        const url = "https://caoysgcthv6knwsicmkdez3d3a0zpdhx.lambda-url.us-east-2.on.aws"; //'https://vc5efboseb.execute-api.us-east-2.amazonaws.com/prod/';
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(message)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result: Response = await response.json();
            console.log('Response from API:', result);
            return result.llm_response;
        } catch (error) {
            console.error('Error making API call:', error);
        }
    }
    return {handleSendMessage};
}
