import mitt from 'mitt'

type Events = { 'picture:updated': { id: string } }

const emitter = mitt<Events>()

export default emitter