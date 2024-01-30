import { PromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { JsonOutputFunctionsParser } from "langchain/output_parsers";
import type { Context } from "@netlify/functions"

export default (req: Request, context: Context): Promise<Response> => {

    const prompt = PromptTemplate.fromTemplate(`Hello there! can you tell me a joke about {thing}?`);

    const llm = new ChatOpenAI({
        modelName: "gpt-3.5-turbo",
        temperature: 0,
        // fail at the first rate limit error
        maxRetries: 5,
        // no more than two queries at the same time
    });

    const chain = prompt
        .pipe(llm.bind({
            functions: [{
                name: "extractor",
                description: "The given joke text",
                parameters: {
                    type: "object",
                    properties: {
                        html: {
                            type: "string",
                            description: "the text of the joke in simple html format",
                        },
                        text: {
                            type: "string",
                            description: "the text of the joke without formatting in simple text",
                        },
                    },
                    required: ["html", "text"],
                },
            }],
            function_call: { name: "extractor" },
        }))
        .pipe(new JsonOutputFunctionsParser());


    return chain.invoke({ thing: "dogs" }).then(({ text }) => new Response(text));
};