import { v4 as uuidv4 } from 'uuid';

export const generateUUID = (): string => {
  return uuidv4();
};

export const generateTicketId = (): string => {
  return `TKT-${Date.now()}-${Math.random().toString(36).substring(7)}`;
};
