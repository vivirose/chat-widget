export type Prompt = {
    user_email: string,
    waf_token: string,
    chat_prompt: string
};

export type Response = {
    llm_response: string,
    conversation_id: string
};

