const TOKEN_PATTERN = /^(login|register)-token-\d+$/;

export const getAuthSession = () => {
  const token = localStorage.getItem('authToken');
  const rawUser = localStorage.getItem('authUser');

  if (!token || !rawUser || !TOKEN_PATTERN.test(token)) {
    return null;
  }

  try {
    const user = JSON.parse(rawUser);

    if (!user?.id || !user?.email || user.token !== token) {
      return null;
    }

    return { token, user };
  } catch {
    return null;
  }
};

export const isValidAuthSession = () => Boolean(getAuthSession());

export const clearAuthSession = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('authUser');
};
