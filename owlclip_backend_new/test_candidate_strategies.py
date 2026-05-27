import asyncio
import time
from app.core.config import settings
from app.services.media.analysis.llm_analyzation import HookAnalysisService

sample_transcript = """
{
    "text": "AI is becoming more intelligent every single day and it's changing what's possible.",
    "segments": [
        {"chunk_id": 1, "text": "AI is becoming...", "start": 0, "end": 30}
    ]
}
"""

async def test_llm():
    print("=" * 60)
    print("🧪 LLM TEST SUITE")
    print("=" * 60)

    # 1. Config check
    print(f"GROQ: {'OK' if settings.GROQ_API_KEY else 'MISSING'}")
    print(f"GEMINI: {'OK' if settings.GEMINI_API_KEY else 'MISSING'}")

    service = HookAnalysisService()

    if not service.primary and not service.fallback:
        print("❌ No providers configured")
        return

    # 2. Performance + response test
    start = time.time()

    try:
        result = await service.analyze_transcript(sample_transcript)
        latency = time.time() - start

        print(f"\n⏱ Latency: {latency:.2f}s")

        # 3. Null check
        if not result:
            print("❌ No result returned")
            return

        # 4. Schema validation
        if not hasattr(result, "hooks"):
            print("❌ Invalid schema: missing hooks")
            return

        print(f"\n✅ Hooks found: {len(result.hooks)}")

        # 5. Content validation
        for i, hook in enumerate(result.hooks):
            if not hasattr(hook, "viral_score"):
                print(f"❌ Hook {i} missing viral_score")
                continue

            print(f"- {hook.title[:40]} | Score: {hook.viral_score}")

            # sanity check
            if not (0 <= hook.viral_score <= 10):
                print(f"⚠️ Invalid score range: {hook.viral_score}")

        print("\n✅ LLM TEST PASSED")

    except Exception as e:
        print(f"❌ LLM TEST FAILED: {e}")

if __name__ == "__main__":
    asyncio.run(test_llm())