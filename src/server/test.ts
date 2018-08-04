import * as akala from '@akala/server';
import * as bonjourFn from 'bonjour';
import * as os from 'os'


akala.each(os.networkInterfaces(), (nics, iface) =>
{
    akala.each(nics, function (nic)
    {
        if (nic.family == 'IPv4')
        {
            var bonjour = bonjourFn({ interface: nic.address });

            bonjour.find({}, function (service)
            {
                console.log(service);
            })
        }
    })
});