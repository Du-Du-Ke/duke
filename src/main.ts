import { init } from './init';
import { registerSlashCommand } from './bot';

(async () => {
    /**
     * The init function must always be called first, because it ensures
     * everything needed to run is ready.
     */
    init();
    
    await registerSlashCommand();
})();