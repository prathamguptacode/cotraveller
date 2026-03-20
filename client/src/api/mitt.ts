import mitt, { type Emitter, type EventType } from 'mitt'

type LoaderEvent = Emitter<Record<EventType, unknown>> & {
    emit: (event: 'startLoading' | 'stopLoading') => void
}

export const loaderEvent: LoaderEvent = mitt()