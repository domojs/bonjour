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

        akala.each(os.networkInterfaces(), (nics) =>
        {
            akala.each(nics, function (nic)
            {
                if (nic.family == 'IPv4')
                {
                    const bonjour = bonjourFn({ interface: nic.address });

                    bonjour.find(null, function (service)
                    {
                        akala.logger.info(service);
                        zeroconf.add(service);
                    }).on('down', function (service)
                    {
                        zeroconf.delete(service);
                    });
                }
            })
        });
    }
});