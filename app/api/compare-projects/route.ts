import { streamText } from 'ai'

export async function POST(req: Request) {
  const { projectA, projectB, activeCategories } = await req.json()

  const categoryContext = activeCategories.join(', ')

  const prompt = `You are a senior construction portfolio analyst. Compare the following two projects across these categories: ${categoryContext}.

Project A: ${projectA.name} (${projectA.location})
- Typology: ${projectA.typology} | PM: ${projectA.pm} | Contract: €${projectA.contractValue}M | Status: ${projectA.status}
- Delay: ${projectA.delayDays} days | SPI: ${projectA.spi} | CPI: ${projectA.cpi}
- CI Planned: ${projectA.ciPlanned}% | CI Adjusted: ${projectA.ciAdjusted}% | CI Analytical: ${projectA.ciAnalytical}%
- Budget Variance: €${projectA.budgetVariance}M | Accumulated Production: €${projectA.accumulatedProduction}M / €${projectA.expectedProduction}M expected
- PPC: ${projectA.ppc}% | TMR: ${projectA.tmr}%

Project B: ${projectB.name} (${projectB.location})
- Typology: ${projectB.typology} | PM: ${projectB.pm} | Contract: €${projectB.contractValue}M | Status: ${projectB.status}
- Delay: ${projectB.delayDays} days | SPI: ${projectB.spi} | CPI: ${projectB.cpi}
- CI Planned: ${projectB.ciPlanned}% | CI Adjusted: ${projectB.ciAdjusted}% | CI Analytical: ${projectB.ciAnalytical}%
- Budget Variance: €${projectB.budgetVariance}M | Accumulated Production: €${projectB.accumulatedProduction}M / €${projectB.expectedProduction}M expected
- PPC: ${projectB.ppc}% | TMR: ${projectB.tmr}%

Provide a concise, structured comparison in 3-4 short paragraphs. Focus on:
1. Which project is performing better and why
2. Key risk areas in each project
3. A specific recommendation for each PM

Be direct, analytical, and use the data. No bullet points — flowing professional prose only.`

  const result = streamText({
    model: 'openai/gpt-4o-mini',
    prompt,
    maxOutputTokens: 400,
  })

  return result.toUIMessageStreamResponse()
}
