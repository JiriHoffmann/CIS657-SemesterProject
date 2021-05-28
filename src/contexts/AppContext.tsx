import React, { Dispatch, FunctionComponent, SetStateAction, useState } from 'react';

type AppContextType = {
	user: string;
	setUser: Dispatch<SetStateAction<string>>;
};

// Sets the correct types for context whenever it's imported
const AppContext = React.createContext({} as AppContextType);
export default AppContext;

// Provides values in all children components
const AppProvider: FunctionComponent = ({ children }) => {
	const [user, setUser] = useState<string>('');

	return <AppContext.Provider value={{ user, setUser }}>{children}</AppContext.Provider>;
};

export { AppProvider };
