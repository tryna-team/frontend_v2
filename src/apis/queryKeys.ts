// # Query Key
export const queryKeys = {
  events: {
    all: ['events'] as const,

    detail: (eventId: number) => ['events', 'detail', eventId] as const,
  },

  calendars: {
    all: ['calendars'] as const,

    main: (year: number, month: number, selectedDate: string) =>
      ['calendars', 'main', year, month, selectedDate] as const,

    dateEvents: (date: string) => ['calendars', 'dateEvents', date] as const,
  },
};
