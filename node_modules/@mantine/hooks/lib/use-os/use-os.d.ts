export type OS = 'undetermined' | 'macos' | 'ios' | 'windows' | 'android' | 'linux' | 'chromeos';
interface UseOsOptions {
    getValueInEffect: boolean;
}
export declare function useOs(options?: UseOsOptions): OS;
export {};
