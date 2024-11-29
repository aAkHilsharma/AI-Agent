import { JSONFilePreset } from 'lowdb/node'
import type { AIMessage } from '../types'
import { v4 as uuid } from 'uuid'

export type MessageWithData = AIMessage & {
    id: string;
    createdAt: string
}

export const addMetadata = (message: AIMessage): MessageWithData => ({
    ...message,
    id: uuid(),
    createdAt: new Date().toISOString()
})

export const removeMetaData = (message: MessageWithData): AIMessage => {
    const { id, createdAt, ...messageWithoutMetaData } = message
    return messageWithoutMetaData;
}

type Data = {
    messages: MessageWithData[]
}

const defaultData: Data = { messages: [] }

export const getDb = async() => {
    const db = await JSONFilePreset<Data>('db.json', defaultData);
    return db;
}

export const addMessages = async (messages: AIMessage[]) => {
    const db = await getDb();

    db.data.messages.push(...messages.map(addMetadata))
    await db.write();
}

export const getMessages = async() => {
    const db = await getDb();
    return db.data.messages.map(removeMetaData)
}

export const saveToolResponse = async (toolCallId: string, toolResponse: string) => {
    return addMessages([
        {
            role: 'tool',
            content: toolResponse,
            tool_call_id: toolCallId,
        }
    ])
}