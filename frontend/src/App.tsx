// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
// import { SnackbarProvider } from 'notistack';
// import { BrowserRouter } from 'react-router-dom';
// import { AuthProvider } from './contexts';
// import Routes from './routes';

// function App() {
// 	const queryClient = new QueryClient();

// 	return (
// 		<BrowserRouter>
// 			<QueryClientProvider client={queryClient}>
// 				<SnackbarProvider
// 					autoHideDuration={1500}
// 					anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
// 					disableWindowBlurListener>
// 					<AuthProvider>
// 						<Routes />
// 					</AuthProvider>
// 				</SnackbarProvider>

// 				<ReactQueryDevtools initialIsOpen={false} />
// 			</QueryClientProvider>
// 		</BrowserRouter>
// 	);
// }

// export default App;

// App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SnackbarProvider } from 'notistack';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts'; // Import from the updated contexts
import Routes from './routes';

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
            <SnackbarProvider
              autoHideDuration={1500}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              disableWindowBlurListener
            >
              <Routes />
            </SnackbarProvider>
            <ReactQueryDevtools initialIsOpen={false} />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
