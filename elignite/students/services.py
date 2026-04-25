from __future__ import annotations

import re
from dataclasses import dataclass

from .models import AIAssistantKnowledge, User


@dataclass
class AssistantResponse:
    answer: str
    matches: list[AIAssistantKnowledge]


def _tokens(text: str) -> set[str]:
    return {t for t in re.findall(r"[a-zA-Z0-9']+", text.lower()) if len(t) > 2}


def answer_with_local_knowledge(query: str, user: User | None = None) -> AssistantResponse:
    query_tokens = _tokens(query)

    allowed_roles = [AIAssistantKnowledge.ROLE_ALL]
    if user and user.is_authenticated:
        allowed_roles.append(user.role)

    entries = list(
        AIAssistantKnowledge.objects.filter(is_active=True, role_target__in=allowed_roles).order_by('-priority')
    )

    scored: list[tuple[int, AIAssistantKnowledge]] = []
    for entry in entries:
        keywords = _tokens(entry.keywords)
        question_tokens = _tokens(entry.question)
        score = len(query_tokens & keywords) * 3 + len(query_tokens & question_tokens)
        if entry.question.lower() in query.lower():
            score += 4
        if score > 0:
            scored.append((score, entry))

    scored.sort(key=lambda x: (x[0], x[1].priority), reverse=True)
    top_matches = [item[1] for item in scored[:3]]

    if top_matches:
        answer_blocks = [f"{idx}. {entry.answer}" for idx, entry in enumerate(top_matches, start=1)]
        answer = (
            "I found the most relevant guidance from your ELIGNITE knowledge base:\n\n"
            + "\n\n".join(answer_blocks)
            + "\n\nNeed more detail? Ask with program name, role, or workflow step."
        )
        return AssistantResponse(answer=answer, matches=top_matches)

    fallback = (
        "I do not have a direct match yet. Here is how to use ELIGNITE:\n"
        "- Students: login with matricule, open Student Dashboard, review attendance/results/payments, submit testimonials.\n"
        "- Teachers: use Teacher Dashboard to create exercises/projects, mark attendance, and monitor performance.\n"
        "- Admin: configure programs, approve enrollments, and manage system settings.\n"
        "Please ask a more specific question so I can search the local database better."
    )
    return AssistantResponse(answer=fallback, matches=[])
