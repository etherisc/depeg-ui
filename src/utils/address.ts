

export function formatAddress(address: string, isMobile: boolean = false) {
    if (isMobile) {
        return `0x…${address.substring(address.length - 4)}`;
    }
    
    return `${address.substring(0, 6)}…${address.substring(address.length - 4)}`;
}
