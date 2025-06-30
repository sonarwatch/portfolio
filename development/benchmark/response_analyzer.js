const fastFetchers = [
    'jupiter-exchange-perpetual',
    'marginfi-deposits',
    'meteora-dlmm-positions',
    'native-stake-solana',
    'phoenix-positions',
    'pyth-staking'
]

fetch(`http://localhost:3001/api/v1/addresses/4ja2N12Zczh9K25zGFTfao6yPdTZSfA5Bw4QueSmQCYJ/portfolio?${Date.now()}`).then(async result => {
    const data = await result.json()
    const failed = data.fetcherReports.filter(r => r.error);
    const longestHelius = data.fetcherReports.filter(r => r.duration)
        .filter(f => fastFetchers.includes(f.id))
        .sort((r, r1) => r1.duration - r.duration)
        .slice(0, 5);
    const longestGetBlock = data.fetcherReports.filter(r => r.duration)
        .filter(f => !fastFetchers.includes(f.id))
        .sort((r, r1) => r1.duration - r.duration)
        .slice(0, 5);
    console.log(`Duration: ${data.duration} Failed items: ${failed.length}`);
    failed.forEach(f => console.log(`\tProtocol: ${f.id.padEnd(30)} with ${f.error}`))
    console.log('Helius 5 Longest runs: ')
    longestHelius.forEach(f => console.log(`\tProtocol: ${f.id.padEnd(30)} with ${f.duration}ms`))
    console.log('Helius Queries for longest requests:')
    longestHelius.forEach(f => console.log(`\tnpx nx run plugins:run-fetcher ${f.id} ${data.owner}`))
    console.log('\n\n\nGetBlock 5 Longest runs: ')
    longestGetBlock.forEach(f => console.log(`\tProtocol: ${f.id.padEnd(30)} with ${f.duration}ms`))
    console.log('GetBlock Queries for longest requests:')
    longestGetBlock.forEach(f => console.log(`\tnpx nx run plugins:run-fetcher ${f.id} ${data.owner}`))
});


