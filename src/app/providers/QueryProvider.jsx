import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime:  1000 * 60 * 5,  // data dianggap fresh selama 5 menit
      retry:      1,               // coba sekali lagi jika gagal
      refetchOnWindowFocus: false, // hindari refetch agresif saat pindah tab
    },
  },
});

export function QueryProvider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
