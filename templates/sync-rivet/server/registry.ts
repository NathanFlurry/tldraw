import { TLSocketRoom } from "@tldraw/sync-core";
import {
	type TLRecord,
	createTLSchema,
	defaultShapeSchemas,
} from "@tldraw/tlschema";
import { actor, setup, type UniversalWebSocket } from "rivetkit";

const schema = createTLSchema({
	shapes: { ...defaultShapeSchemas },
});

const tldrawRoom = actor({
	state: {
		snapshot: null as any,
	},
	createVars: () => {
		return {
			room: undefined as TLSocketRoom<TLRecord, void> | undefined,
		};
	},
	actions: {
		ping: async () => {
			return { status: "ok" };
		},
	},
	onWebSocket: async (c, websocket: UniversalWebSocket, { request }) => {
		const url = new URL(request.url);
		const sessionId = url.searchParams.get("sessionId");

		if (!sessionId) {
			websocket.close(1008, "Missing sessionId");
			return;
		}

		if (!c.vars.room) {
			const initialSnapshot = c.state.snapshot || undefined;
			c.vars.room = new TLSocketRoom<TLRecord, void>({
				schema,
				initialSnapshot,
			});
		}

		c.vars.room.handleSocketConnect({
			sessionId,
			socket: websocket,
		});
	},
});

export const registry = setup({
	use: { tldrawRoom },
});
