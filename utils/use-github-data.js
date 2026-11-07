"use client";

import { useEffect, useState } from "react";

// Module-level cache so every component shares a single request per page load.
let cachedData = null;
let pendingRequest = null;

function loadGithubData() {
  if (cachedData) {
    return Promise.resolve(cachedData);
  }
  if (!pendingRequest) {
    pendingRequest = fetch("/api/github")
      .then((res) => res.json())
      .then((json) => {
        if (!json || json.success === false) {
          throw new Error((json && json.error) || "Failed to load GitHub data");
        }
        cachedData = json;
        return json;
      })
      .catch((error) => {
        pendingRequest = null;
        throw error;
      });
  }
  return pendingRequest;
}

export function useGithubData() {
  const [data, setData] = useState(cachedData);
  const [loading, setLoading] = useState(!cachedData);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    if (cachedData) {
      setData(cachedData);
      setLoading(false);
      return () => {
        active = false;
      };
    }

    loadGithubData()
      .then((json) => {
        if (!active) return;
        setData(json);
        setError(null);
      })
      .catch((err) => {
        if (!active) return;
        setError(err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { data, loading, error };
}
