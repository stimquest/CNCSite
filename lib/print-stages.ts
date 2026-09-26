import type { WeeklyPlanning } from '@/types';

export interface PrintStageDefinition {
    key: string;
    label: string;
    isActive?: boolean;
}

// Keep historical groups with saved slots, even if their definition was disabled.
export function getPrintStageGroups(planning: WeeklyPlanning, definitions: PrintStageDefinition[]) {
    const used = new Set((planning.days || []).flatMap(day => (day.stageSlots || []).map(slot => slot.stageKey)));
    const groups = definitions
        .filter(stage => stage.isActive || used.has(stage.key))
        .map(stage => ({ id: stage.key, label: stage.label }));
    for (const key of used) {
        if (!groups.some(group => group.id === key)) groups.push({ id: key, label: key });
    }
    return groups;
}
