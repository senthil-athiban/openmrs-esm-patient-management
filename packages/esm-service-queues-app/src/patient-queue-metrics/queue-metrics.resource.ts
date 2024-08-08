import useSWR from 'swr';
import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';
import { type Appointment, type QueueServiceInfo } from '../types';
import { startOfDay } from '../constants';

export function useServiceMetricsCount(service: string, location: string) {
  const status = 'Waiting';
  const apiUrl =
    `${restBaseUrl}/queue-entry-metrics?status=${status}&isEnded=false` +
    (service ? `&service=${service}` : '') +
    (location ? `&location=${location}` : '');

  const { data } = useSWR<
    {
      data: {
        count: number;
      };
    },
    Error
  >(service ? apiUrl : null, openmrsFetch);

  return {
    serviceCount: data ? data?.data?.count : 0,
  };
}

export const useAppointmentMetrics = () => {
  const apiUrl = `${restBaseUrl}/appointment/all?forDate=${startOfDay}`;

  const { data, error, isLoading } = useSWR<{
    data: Array<Appointment>;
  }>(apiUrl, openmrsFetch);

  const totalScheduledAppointments = data?.data.length ?? 0;

  return {
    isLoading,
    error,
    totalScheduledAppointments,
  };
};
