import React, { useState, useMemo } from 'react';
import { Card, Stack, Text, TextInput, Grid, Button, Box, Flex } from '@sanity/ui';
import { set, unset } from 'sanity';
import * as LucideIcons from 'lucide-react';

// Liste d'icônes recommandées pour le CNC
const RECOMMENDED_ICONS = [
    'Anchor', 'Wind', 'Waves', 'Compass', 'MapPin', 'Calendar', 'Clock', 'Phone', 'Mail',
    'Users', 'Info', 'Shield', 'Trophy', 'LifeBuoy', 'Ship', 'Sun', 'Cloud', 'Droplets',
    'Activity', 'Target', 'Zap', 'Star', 'Heart', 'HelpCircle', 'GraduationCap', 'CheckCircle2'
];

export const IconPicker = (props: any) => {
    const { elementProps, onChange, value = '' } = props;
    const [search, setSearch] = useState('');

    // Filtrer toutes les icônes Lucide disponibles
    const allIconNames = Object.keys(LucideIcons).filter(
        (name) => typeof (LucideIcons as any)[name] === 'function' || typeof (LucideIcons as any)[name] === 'object'
    );

    const filteredIcons = useMemo(() => {
        if (!search) return RECOMMENDED_ICONS;
        return allIconNames
            .filter((name) => name.toLowerCase().includes(search.toLowerCase()))
            .slice(0, 30); // Limiter pour la performance
    }, [search]);

    const handleChange = (iconName: string) => {
        onChange(iconName ? set(iconName) : unset());
    };

    const SelectedIcon = value && (LucideIcons as any)[value] ? (LucideIcons as any)[value] : null;

    return (
        <Card padding={3} border radius={3}>
            <Stack space={3}>
                {/* Affichage de l'icône sélectionnée */}
                <Flex align="center" gap={3} padding={2} style={{ background: '#f4f6f8', borderRadius: '8px' }}>
                    <Box style={{ fontSize: '24px', minWidth: '40px', display: 'flex', justifyContent: 'center' }}>
                        {SelectedIcon ? <SelectedIcon size={24} /> : <div style={{ opacity: 0.3 }}><LucideIcons.Search size={24} /></div>}
                    </Box>
                    <Box flex={1}>
                        <Text weight="bold" size={1}>
                            {value || 'Aucune icône sélectionnée'}
                        </Text>
                        {value && (
                            <Button
                                fontSize={1}
                                padding={2}
                                mode="bleed"
                                tone="critical"
                                text="Effacer"
                                onClick={() => handleChange('')}
                            />
                        )}
                    </Box>
                </Flex>

                {/* Recherche */}
                <TextInput
                    placeholder="Rechercher une icône (ex: sailboat, wind...)"
                    value={search}
                    onChange={(event) => setSearch(event.currentTarget.value)}
                    {...elementProps}
                />

                {/* Grille d'icônes */}
                <Box style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    <Grid columns={[4, 5, 8]} gap={1}>
                        {filteredIcons.map((iconName) => {
                            const Icon = (LucideIcons as any)[iconName];
                            if (!Icon) return null;
                            return (
                                <Button
                                    key={iconName}
                                    mode={value === iconName ? 'default' : 'ghost'}
                                    tone={value === iconName ? 'primary' : 'default'}
                                    onClick={() => handleChange(iconName)}
                                    title={iconName}
                                    padding={2}
                                >
                                    <Flex align="center" justify="center">
                                        <Icon size={18} />
                                    </Flex>
                                </Button>
                            );
                        })}
                    </Grid>
                </Box>
                <Text size={1} muted>
                    {search ? `${filteredIcons.length} icônes trouvées` : 'Icônes recommandées'}
                </Text>
            </Stack>
        </Card>
    );
};
