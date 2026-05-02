import React, { createContext, useState, useCallback, useRef } from 'react';
import { parkingLotAPI, parkingSlotAPI } from '../services/api';
import {
  initializeSocket,
  joinLot,
  leaveLot,
  onSlotUpdated,
  offSlotUpdated,
} from '../services/socket';

export const ParkingContext = createContext();

export const ParkingProvider = ({ children }) => {
  const [lots, setLots] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const currentLotRef = useRef(null);

  // Initialize socket
  React.useEffect(() => {
    initializeSocket();
  }, []);

  const fetchLots = useCallback(async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      setError(null);
      const response = await parkingLotAPI.getLots(page, limit);
      setLots(response.data.lots);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch parking lots';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSlots = useCallback(async (lotId, page = 1, limit = 50) => {
    try {
      setLoading(true);
      setError(null);

      // Join socket room for this lot
      if (currentLotRef.current !== lotId) {
        if (currentLotRef.current) leaveLot(currentLotRef.current);
        joinLot(lotId);
        currentLotRef.current = lotId;
      }

      const response = await parkingSlotAPI.getSlots(lotId, page, limit);
      setSlots(response.data.slots);

      // Subscribe to slot updates
      const handleSlotUpdate = (data) => {
        setSlots((prevSlots) =>
          prevSlots.map((slot) =>
            slot._id === data.slotId
              ? { ...slot, status: data.status }
              : slot
          )
        );
      };

      onSlotUpdated(handleSlotUpdate);

      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch slots';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearLotData = useCallback(() => {
    if (currentLotRef.current) {
      leaveLot(currentLotRef.current);
      currentLotRef.current = null;
    }
    offSlotUpdated(() => {});
    setSlots([]);
  }, []);

  const value = {
    lots,
    slots,
    loading,
    error,
    fetchLots,
    fetchSlots,
    clearLotData,
  };

  return (
    <ParkingContext.Provider value={value}>
      {children}
    </ParkingContext.Provider>
  );
};
