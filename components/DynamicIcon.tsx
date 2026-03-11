import * as LucideIcons from 'lucide-react';

export const DynamicIcon = ({ name, ...props }: { name: string } & LucideIcons.LucideProps) => {
    // Handle empty or missing names gracefully
    if (!name) {
        const FallbackIcon = LucideIcons.HelpCircle;
        return <FallbackIcon {...props} />;
    }

    // Basic formatting to ensure it matches the Lucide pascal case names
    // e.g. "wifi" -> "Wifi", "party-popper" -> "PartyPopper"
    const formattedName = name
        .split('-')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join('');
        
    const IconComponent = (LucideIcons as any)[formattedName] || (LucideIcons as any)[name];
    
    if (!IconComponent) {
        // Fallback to a help circle if the icon doesn't exist to prevent crash
        const FallbackIcon = LucideIcons.HelpCircle;
        return <FallbackIcon {...props} />;
    }
    
    return <IconComponent {...props} />;
};
