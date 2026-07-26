import type { AppClient } from '@/types/user';

export type IranRoutingClient = {
  id: 'happ' | 'streisand' | 'v2rayng';
  appName: string;
  appAliases: string[];
  initials: string;
  importKind: 'app' | 'clipboard';
  importValue: string;
  guideStepsKey: string;
};

const normalizeAppName = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]/g, '');

export const findRoutingClientIcon = (
  apps: AppClient[] | undefined,
  client: IranRoutingClient,
) => {
  if (!apps?.length) return null;

  const aliases = new Set(
    [client.appName, ...client.appAliases].map(normalizeAppName),
  );

  return (
    apps.find(
      (app) =>
        Boolean(app.icon_url) && aliases.has(normalizeAppName(app.name)),
    )?.icon_url ?? null
  );
};

const v2rayNgRules = [
  {
    enabled: true,
    locked: false,
    network: 'udp',
    outboundTag: 'block',
    port: '443',
    remarks: 'Block UDP 443',
  },
  {
    enabled: true,
    ip: ['geoip:private'],
    locked: false,
    outboundTag: 'direct',
    remarks: 'Direct private IP',
  },
  {
    domain: ['geosite:private'],
    enabled: true,
    locked: false,
    outboundTag: 'direct',
    remarks: 'Direct private domains',
  },
  {
    domain: ['domain:ir', 'geosite:category-ir'],
    enabled: true,
    locked: false,
    outboundTag: 'direct',
    remarks: 'Direct Iran domains',
  },
  {
    enabled: true,
    ip: ['geoip:ir'],
    locked: false,
    outboundTag: 'direct',
    remarks: 'Direct Iran IP',
  },
];

const happRoutingProfile = {
  BlockIp: [],
  BlockSites: [],
  DirectIp: [
    '10.0.0.0/8',
    '172.16.0.0/12',
    '192.168.0.0/16',
    '169.254.0.0/16',
    '224.0.0.0/4',
    '255.255.255.255',
    'geoip:ir',
  ],
  DirectSites: ['geosite:private', 'geosite:ir', 'geosite:category-ir'],
  DnsHosts: {
    'cloudflare-dns.com': '1.1.1.1',
    'dns.google': '8.8.8.8',
  },
  DomainStrategy: 'IPIfNonMatch',
  DomesticDNSDomain: 'https://dns.google/dns-query',
  DomesticDNSIP: '8.8.8.8',
  DomesticDNSType: 'DoH',
  FakeDNS: 'false',
  Geoipurl:
    'https://github.com/Chocolate4U/Iran-v2ray-rules/releases/latest/download/geoip.dat',
  Geositeurl:
    'https://github.com/Chocolate4U/Iran-v2ray-rules/releases/latest/download/geosite.dat',
  GlobalProxy: 'true',
  LastUpdated: 1781531956,
  Name: 'VIPTrue IR Direct',
  ProxyIp: [],
  ProxySites: [],
  RemoteDNSDomain: 'https://cloudflare-dns.com/dns-query',
  RemoteDNSIP: '1.1.1.1',
  RemoteDNSType: 'DoH',
  RouteOrder: 'block-proxy-direct',
};

const encodeAsciiBase64 = (value: string) => {
  if (typeof window === 'undefined') return '';
  return window.btoa(value);
};

const streisandRoutingLink =
  'streisand://aW1wb3J0L3JvdXRlOi8vWW5Cc2FYTjBNRERWQVFJREJBVUdCd2dKQ2xSdVlXMWxWSFYxYVdSZVpHOXRZV2x1VTNSeVlYUmxaM2xkWkc5dFlXbHVUV0YwWTJobGNsVnlkV3hsYzI4UUZnQldBRWtBVUFCVUFISUFkUUJsQUNBQVNRQlNBQzBBUkFCcEFISUFaUUJqQUhRQUlOZzgzZTdZUE4zM1h4QWtOa1UyT1VGQ01FUXRPRUkwTlMwMFJEWkVMVGswTVVRdE1UZ3pSREU0TkVWR01FTTNYRWxRU1daT2IyNU5ZWFJqYUZab2VXSnlhV1NoQzlVRURBME9Ed2tRRkJjWVZtUnZiV0ZwYmxKcGNGZHVaWFIzYjNKclcyOTFkR0p2ZFc1a1ZHRm5veEVTRTE4UUQzSmxaMlY0Y0RwZUxpdGNMbWx5SkY4UUUyZGxiM05wZEdVNlkyRjBaV2R2Y25rdGFYSmZFQTluWlc5emFYUmxPbkJ5YVhaaGRHV2lGUlpZWjJWdmFYQTZhWEpkWjJWdmFYQTZjSEpwZG1GMFpWOFFSRlJEVUN3Z1ZVUlFMQ0JJVkZSUUxDQklWRlJRVXl3Z1UxTklMQ0JUVFZSUUxDQlRUazFRTENCT1ZGQXNJRVpVVUN3Z1VFOVFNeXdnU1UxQlVDd2dWR1ZzYm1WMFZtUnBjbVZqZEFBSUFCTUFHQUFkQUN3QU9nQkFBRzhBbGdDakFLb0FyQUMzQUw0QXdRREpBTlVBMlFEckFRRUJFd0VXQVI4QkxRRjBBQUFBQUFBQUFnRUFBQUFBQUFBQUdRQUFBQUFBQUFBQUFBQUFBQUFBQVhzPQ==';

export const getIranRoutingClients = (): IranRoutingClient[] => [
  {
    id: 'happ',
    appName: 'Happ',
    appAliases: ['Happ Proxy'],
    initials: 'H',
    importKind: 'app',
    importValue: `happ://routing/add/${encodeAsciiBase64(JSON.stringify(happRoutingProfile))}`,
    guideStepsKey: 'routing.clients.happ',
  },
  {
    id: 'streisand',
    appName: 'Streisand',
    appAliases: [],
    initials: 'S',
    importKind: 'app',
    importValue: streisandRoutingLink,
    guideStepsKey: 'routing.clients.streisand',
  },
  {
    id: 'v2rayng',
    appName: 'v2rayNG',
    appAliases: ['V2rayNG', 'V2RayNG'],
    initials: 'V',
    importKind: 'clipboard',
    importValue: JSON.stringify(v2rayNgRules),
    guideStepsKey: 'routing.clients.v2rayng',
  },
];
