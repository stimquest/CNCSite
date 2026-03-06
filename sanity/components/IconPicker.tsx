import React, { useState, useMemo } from 'react';
import { Card, Stack, Text, TextInput, Grid, Button, Box, Flex } from '@sanity/ui';
import { set, unset } from 'sanity';
import * as LucideIcons from 'lucide-react';

export const IconPicker = (props: any) => {
    const { elementProps, onChange, value = '', readOnly } = props;
    const [search, setSearch] = useState('');

    const allIconNames = useMemo(() => {
        return Object.keys(LucideIcons).filter(
            // On ne garde que les composants React (qui commencent par une MAJUSCULE)
            (name) => /^[A-Z]/.test(name)
                && !name.endsWith('Icon')
                && !name.startsWith('Lucide')
                && (typeof (LucideIcons as any)[name] === 'function' || typeof (LucideIcons as any)[name] === 'object')
        );
    }, []);

    const filteredIcons = useMemo(() => {
        if (!search) return allIconNames.slice(0, 150);
        // On enlève les tirets et espaces de la recherche
        const cleanSearch = search.toLowerCase().replace(/[-\s]/g, '');
        return allIconNames
            .filter((name) => name.toLowerCase().includes(cleanSearch))
            .slice(0, 150);
    }, [search, allIconNames]);

    const handleChange = (iconName: string) => {
        if (readOnly) return;
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
                                disabled={readOnly}
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
                    readOnly={readOnly}
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
                                    disabled={readOnly}
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
