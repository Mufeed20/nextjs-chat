import { Redis } from "@upstash/redis";

export const db = new Redis({
    url: 'https://content-lobster-45027.upstash.io',
    token: 'Aa_jASQgM2EzMmFmYzEtYTc2Mi00YjcyLWJlODctODBkYzFjODU4NGFmNTVhMWYwMTYxNjNkNGI2M2JiMTRmYjA2NzY3NWExMDA='
})