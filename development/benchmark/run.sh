# Create k6 test script

command -v k6 >/dev/null 2>&1 || { echo "k6 is not installed. Please install k6 'brew install k6'." >&2; exit 1; }

rm -rf tmp/summary.json
rm -rf tmp/responses.txt
rm -rf tmp/result.json

cat <<EOF > load-test.js
import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  vus: 2,
  duration: '2m',
  summaryTimeUnit: 's',
};

const addresses = [
    ['GeVPPqUvfpTJnh9NzhdFBcPpFPxmTVR5oHt6jRRdgrBE'],
    ['71hhezkHQ2dhmPySsHVCCkLggfWzPFEBdfEjbn4NCXMG'],
    ['BBkoocctRizBPsu2WRHx5xvpd21UHx6ARVEDGVw7sAFa'],
    ['2fWyMU2S5ZJMwq9Ay2bwvnfRfiugkJbjWZ8WqKMtD8my'],
    ['AeZDiNSSTvGxxD92vao15YRV7f4c4Q1GfcKnwezXucZa'],
    ['2oezxTc6iFjzfujyxtQYHRrCf6wtYZAUZ8a2bNLta1f6'],
    ['EMghDRPH2mFiR8a1QN8JigxBtJqRayaQyKqBPkhBgHSQ'],
    ['GZJhTLSHcmpEDzG5waLgpRTV4oRnywT2G5wQxqxujMo1'],
    ['5SeoMg7JPsG2VNg7F3MfYr4bZtqVVdkhinMnofc5F7kz'],
    ['JD38n7ynKYcgPpF7k1BhXEeREu1KqptU93fVGy3S624k'],
    ['kip312wW3Wh9TLMcU2xmu2eBSJp16JNLps6NwPLdrtq'],
    ['7gUBx3qY99KTG8hxzLT3gTJi1KZrb2D4JjFwa7s8wkL6'],
    ['AECTMxLqHaSL8QznVZSWp3ozuKjzKfRPTy65ZP2jdvvr'],
    ['YubQzu18FDqJRyNfG8JqHmsdbxhnoQqcKUHBdUkN6tP'],
    ['8LsTnvixrXD4h7jBN1JYXyETvJ12uKcV1KttRXLPtf3r'],
    ['3nnNcNMPnSdnF73QvggjF98yZM926L7Z4cZ67r442bkM'],
    ['9BczJxhYPP1Cq5r7HY6FEexxu7H9Tz3awvDpN2Wpa5N5'],
    ['A74xxcC2m8ZXysN1MoLrpE1VAzeoaqqJnHTqqK2oAmBy'],
    ['6jJzTv6Chb94fjXLCty9mSUpWNVWYQ1re7u3YY77VshX'],
    ['Eo4UpsVyy3WwMfKK5N5keD1iRiVJ9mx3KAMNj62cMGpV'],
    ['CvMMHkPbC3Yt6KV4tfd9GNF91wvzqDKtnwfQHxFXn7zW'],
    ['Gdmbe87SZNu2maEjwbaN9thGDnDiJ4f425fK1QuhAyWu'],
    ['Dz9rGzXmdt1G7T6eJkkxQ2UgjGKtkFDQALVm2PEAnMfi'],
    ['Hp8SsZZZot8UB28HTfEuxxCXECoSiwHfpzqwenjrMPKF'],
    ['AVAZvHLR2PcWpDf8BXY4rVxNHYRBytycHkcB5z5QNXYm'],
    ['EHRmXYsGb3p8pkCfEP8Au5Yzadj9LjZZ9AXtxC7nhRGM'],
    ['26eD6MYX87wvuUGzY6pFXQavDE1maQxrxYcQyamKyq4L'],
    ['9aLGetpfjFVfZeSVJAXQ2LgXpLyvHEYt44aqnNR5oze5'],
    ['4TtFSyjd3K7puypp5mocHV3hZfFNY9phULg8s8wRXJHR'],
    ['BkyB5Z6MpyqX6oNytpcLmpb2UeLioRt1Br2JFrPPsFr8'],
    ['Dy2VtAsu8czQzQddDWfkbi4gB7m475E9526nstRwt6j2'],
    ['GMUMYeqmVjbmHTNBP8HQzwEx4pc9EZR2eZG2BpS2FvkN'],
    ['GxhX3G4m36KbPeDmeE3PcxHpHknatt6bAVgxhzeTJE7e'],
    ['9L9GBaQLaPqFxdSQsT4MWuZpCQdxuUCsV1eD8Z7wUP1i'],
    ['AF54v9fJU6GFQuKbde3QRfDDuDdAM9p5oEekEMHxHynG'],
    ['AdcvkciZKEn3KtmVhohqfT5njJ9p3PFTubz1VXpJ8XfB'],
    ['Dvd2HA4Ub3PLYnMUvWkaGyRjpXCVbn6GWusqnUZMWtKf'],
    ['9LUECbPV8z92s2kU5jG2kkBSA9d8TJyt14EBQt4HTK5c'],
    ['GkPpc1auG5FPgqQXYytEUUndZstZESh3h3bPPJ9jyZ4b'],
    ['XMEFaswALaywPjp1m3x99c2HcJaVe4NS35vsYxUQio9'],
    ['7291jBKfK26opDgaVBh4bzSS4nnhM9wF8qWEUHnDLxXQ'],
    ['C7Phbca7dKtqe6VcqCkRF9tNBf9vgWoCZtjbgn2582qa'],
    ['DHYMcrz2H3zgpXHzAWTudFV7DqShD1EG876w2XCDnLuh'],
    ['FN3QoYMVf5mtpynUdSk3goxvsFGKEYMty9B2NAdMLWkV'],
    ['RaUrnqZ1FPSYZur88aAi23uiNLUsv9yVU4GkPFXcjPx'],
    ['3qt8gCNYXrpFs6Fc2etZ4knsbkAyGCnXR6afKW9L8K7S'],
    ['JCEnj3fLt2efXxfEDqmf7REHF1gLe8nHLzWQqurdk5Q6'],
    ['2nCAytXuQtuTxuwy99RhPtrk2ZrUCdc1SZyr3qR332HL'],
    ['NKeBkVTMPdSA8SPpt3FfW2VGLMMp52gbaWigDGb5b7F'],
    ['HdWwPCKV1b6r72qkT6tAAps21BgCkrUyGyubWTq9r32G'],
    ['6D57DfQQAYpJJSuX3ThsZonDyngoUqF1WXsddtJfzxn3'],
    ['2Z2XGeySHFtXgjqqnREUtWPTKDyjMWGCWjrvCASijKnF'],
    ['BfPBzNYfwbpxKfMbM1wcSfviYSet8bsQ3FvHqaEVkW7L'],
    ['FF8aVMyHMWCEmHs59ejsk1995jm7ycw4nf7Kh2sP2Fhd'],
    ['6u8H8ys4d9uiTpuC1su5VzJHnuwRt6KRoDJqUxshtbxE'],
    ['6kxJzfnCs3cRW4Ge8WTPoCqv5i3AH7TNveWHAikiwYPv'],
    ['9JSNB2mFZUw5t1YxAv9c4erDGTaVdpVj6MDXJG4kaMdn'],
    ['HAWK3BVnwptKRFYfVoVGhBc2TYxpyG9jmAbkHeW9tyKE'],
    ['4k8daTpVesQHS3umrFHgFAByiJFEdFEvr7Y1HMge8qJY'],
    ['8nTbdw18RLRN1oxS9XEcSLN7f67H8LK2sT5XBQxHFzJw'],
    ['9j6dHYVg6jkWX2Ejp1i6M4HkzRqKtVdWfLNE9ZUhsUxM'],
    ['GpzPCzxgmQTvt2NZNXPJvu4aUug3zuM36WNo58EaDCyo'],
    ['HozvoQXis8aRUZZYbJqsy6hDuMMdHf1eyZEi3qQGyD4S'],
    ['Hb1pQiR42QfQpNP876kRYdmHu5SK1qi36y7SMGsP4dNH'],
    ['HU3jE5rFxphjwNga8FepsYyygEQoDDFwjTQnJftRwiVH'],
    ['FLTZ9M9bsWg7RADv3c42Ffb2U5NBMUwNdPdWfY6SF9n8'],
    ['5sRWm1HRK3d4NNxYV81xYaW5CqvKsGASnM4Z297RD56v'],
    ['938GPTGnahbxjHtZYK5ohzLP9B3o6LUt2PGPjzWf7XSu'],
    ['7obUbs9Sap4S5EBx4JuB2m8WUC6EvN1FHRS5QvN8Eg64'],
    ['7TDt8xy8LRiRyeLU6865RHyMBbZkRsdWkdnoerEuwngH'],
    ['91ZZweVKtjVZGZNe2YJApzt4aqGm3nTFfvoKAwQUXYWp'],
    ['BvmV9n5urwKWuxQD6cPESpgtCpTRkW3WrmEcXnNPRiqW'],
    ['DDsVVof9vHURHutsgJEUkFhTFuJscpt81b5DxKEUt6YS'],
    ['7pn2RPZrRqNnP8WAiEENUanBVV5vkYkrxBiULpN6NVPc'],
    ['BKRGb9fsEssNjYZcVo8Kiwt5RG61AbbZFgoaj3g5drQx'],
    ['739Rk8sfNXNUp3cdhgUmFXndDyts111rLPBXsxp4fk2y'],
    ['3R4zxPqkULh21FvgUqxXRXEBsobWWJtBUVrcCYsynpSK'],
    ['DKsjjQdPvtwY6Rr4oDSwtN7gwy7PUqnPHp1GeQCUDb5J'],
    ['HfpdEeFta251yPsWNzQbq8x1xv2AhQM1oA1ZeypCCADR'],
    ['8BSDdFjMFL1czheNCtC97DfDNqBEGatCvTppe9uxjCYo'],
    ['CjTYj7c6sJZ77Ab3khkvE5K93jtyQq1tLyf8UbLjVHS5'],
    ['9ELqGQnJnJkeTJwiSi3mMmED5sGZRxqizvAEQWuuR16v'],
    ['CZTsapMM3AnzBD3oq8yGorPkgjHs6UFTyUkffs5xuVZ7'],
    ['E1oBXj1GWWD1nuGdcmzx57bvjprEYbKLZ6iuzYmrmw1m'],
    ['B6rJt9ZM1Pq1s2u3Xt8WF62ucojXfnENvJjX5tvDx8fs'],
    ['sR4fTMz3hubnumeX31xkxCdWpksqR8jzvVHuTNR5Gwt'],
    ['GXDiFh6A7xCgasoLWgajXnnQeSz31Towpt1bhDKcMGsv'],
    ['4KcF7q6GuXY1LJmx5z7GjHtoCQmdpsitySrDHPXEtEQs'],
    ['1Kr49E4vk7Ez3Nk1QyhSs352taN476u1FZvbEcaZPQX'],
    ['J2qMPHrSJFnU5aFjQUenuH1SdGp6cqPgaPwBDHonWnfU'],
    ['7YgAhjHBhYkCP3jyRRxaFi8ZPgmTV6FKrQtUHip4PUXa'],
    ['DJNS2ctPjowHWDfiHbDU47nRnonR7n2QEPioL4fG35re'],
    ['CSLkU2DX6Vw2QaMPUUcN3rfRxzXhPRntJf2Z24QJZJT'],
    ['C5xZxMmLPQeQUciHYgEKEn3teK5yd6My3Lj623XU81Ec'],
    ['5pixxy9pqbhaqmJpFjqUC3Nu89zveJ9VXRAwY5mvGbzw'],
    ['57wsqY248STx4Amsc1hECszAu9tsZ7p3tYwAhtjro45k'],
    ['6a3hEQPauKdsdB4WrbtnoxfUEknHnSPzEKyiqdRNFfeP'],
    ['7oNp3ZGWwbvQ7uM9jzqjtHSYAVmyJV5DLAD3q25gQywW'],
    ['DJzQTrEe3doCEmXNSzFtXHBMbbV9UKebv5e2yKxknDyS'],
    ['hEPxnF7APGgqtCV5NMAJpeJk5meKen1o1SPcHUrJ75c'],
    ['3EMCpKAbDLs5uuXm9oy5iiR9DgtmpJV6FtkLN6PaQaWx'],
    ['8aruHh6AwzVXgKFFM8H8yBxadQSa5ue1f4fjvPZSM1Eo'],
];

const fastFetchers = [
    'accessprotocol-staking',
    'banx-loans',
    'banx-offers',
    'bonkrewards-staking',
    'citrus-loans',
    'jupiter-exchange-limit',
    'jupiter-exchange-perpetual',
    'jupiter-governance-vote',
    'marginfi-deposits',
    'vaultka-deposits',
    'meteora-dlmm-positions',
    'native-stake-solana',
    'parcl-margin',
    'phoenix-positions',
    'pyth-staking',
    'quarry-positions',
    'raydium-farms',
    'save-obligations',
    'streamflow-vesting',
    'whalesmarket-deposit',
    'hawksight-positions',
    'francium-lending',
    'meteora-cpamm-positions',
    'sns-airdrop',
    'banx-staking',
    'bouncebit-deposit'
]

const prepareSuccessReport = (url, start, res) => {
    const duration = Date.now() - start;
    const result = JSON.parse(res.body);

    if (!result.fetcherReports) {
        console.log({
            url,
            duration,
            status: res.status,
            body: result
        });
    }

    const slowestFastFetchers = result.fetcherReports
        .filter(r => fastFetchers.includes(r.id))
        .filter(r => r.duration)
        .filter(r => r.status === 'succeeded')
        .sort((r, r1) => r1.duration - r.duration)
        .splice(0, 5)
        .map(r => \`\${r.id} => \${r.duration}\`);

    const failedFast = result.fetcherReports
        .filter(r => fastFetchers.includes(r.id))
        .filter(r => r.status === 'failed')
        .map(r => r.id)

    const slowestGenericFetchers = result.fetcherReports
        .filter(r => !fastFetchers.includes(r.id))
        .filter(r => r.duration)
        .filter(r => r.status === 'succeeded')
        .sort((r, r1) => r1.duration - r.duration)
        .splice(0, 5)
        .map(r => \`\${r.id} => \${r.duration}\`);

    const failedGeneric = result.fetcherReports
        .filter(r => !fastFetchers.includes(r.id))
        .filter(r => r.status === 'failed')
        .map(r => r.id)

    console.log({
        url,
        duration,
        status: res.status,
        slowestFastFetchers,
        slowestGenericFetchers,
        failedFast,
        failedGeneric
    });
}

const prepareFailedReport = (url, start, res) => {
    const duration = Date.now() - start;
    console.log({
        url,
        duration,
        status: res.status,
        res: res,
    })
}

export default function () {
    const index = __ITER * options.vus + __VU - 1;
    const [address] = addresses[index % addresses.length];
    const noCache = Date.now() + Math.floor(Math.random() * 5000);

    //const baseUrl = 'https://api.dev.lambda.p2p.org';
    //const url = \`\${baseUrl}/api/v1/chains/solana/wallets/\${address}/balances?noCache=\${noCache}\`;

    const baseUrl = 'https://portfolio-api.lambda.p2p.org';
    const url = \`\${baseUrl}/api/v1/addresses/\${address}/portfolio?noCache=\${noCache}&assetType=DEFI\`;

    const start = Date.now()
    const res = http.get(url, {timeout: '65s', headers: {'Authorization': ''}});

    if (res.status >= 200 && res.status < 300) {
        prepareSuccessReport(url, start, res)
    } else {
        prepareFailedReport(url, start, res)
    }

    sleep(1);
}
EOF

k6 run \
    --summary-export=tmp/summary.json \
    --console-output=tmp/responses.txt \
    --out json=tmp/result.json \
    load-test.js

rm load-test.js
