import * as akala from '@akala/server';
import * as bonjourFn from 'bonjour';
import { EventEmitter } from 'events'
import * as sd from '@domojs/service-discovery';
import * as os from 'os'


akala.injectWithNameAsync(['$isModule', '$agent.zeroconf'], function (isModule: akala.worker.IsModule, client)
{
    if (isModule('@domojs/bonjour'))
    {
        var zeroconf = akala.api.jsonrpcws(sd.meta).createServerProxy(client);

        akala.each(os.networkInterfaces(), (nic, name) =>
        {
            const bonjour = bonjourFn({ interface: name });

            bonjour.find({}).on('up', function (service)
            {
                zeroconf.add(service);
            }).on('down', function (service)
            {
                zeroconf.delete(service);
            });
        });
    }
});