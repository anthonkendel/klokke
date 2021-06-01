import { KAction } from './Action';
import { KSessionData } from './SessionData';

export interface KMessage {
  action: KAction;
  session?: KSessionData;
}
