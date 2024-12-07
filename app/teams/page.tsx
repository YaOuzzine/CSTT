"use client";

import { useState, useEffect } from "react";
import api from "../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Search, Plus, Filter, MoreVertical, X } from "lucide-react";
import Link from "next/link";
import axios from "axios";

export default function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch the teams where the user is a member
  useEffect(() => {
    const fetchMemberTeams = async () => {
      try {
        const response = await api.get("/teams/member/");
        console.log("teams data", response.data);
        setTeams(response.data);
        setFilteredTeams(response.data);
      } catch (error) {
        console.error("Failed to fetch member teams:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMemberTeams();
  }, []);

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = teams.filter((team) =>
      team.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredTeams(filtered);
  };

  // Handle invite submission
  const handleJoinTeam = async () => {
    try {
      const response = await axios.post(`/api/teams/join?invite=${inviteLink}`);
      setSuccessMessage(response.data.message);
      setInviteLink("");
      setShowInviteModal(false);
      refreshTeams(); // Refresh the team list after joining
    } catch (err) {
      setError(err.response?.data?.error || "Failed to join the team");
    }
  };

  // Refresh team list
  const refreshTeams = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/teams/member");
      setTeams(response.data);
      setFilteredTeams(response.data);
    } catch (error) {
      console.error("Failed to refresh teams:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 transition-colors duration-500">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Teams</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Manage your teams or join new ones.
            </p>
          </div>
          <div className="flex space-x-4">
            <Link
              href="/teams/create"
              className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Team
            </Link>
            <button
              onClick={() => setShowInviteModal(true)}
              className="inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-lg"
            >
              Join Team
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search teams..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all"
                />
              </div>
              <button className="inline-flex items-center justify-center px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                <Filter className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
                Filters
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Teams List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {loading ? (
    <div className="col-span-full flex justify-center">
      <p className="text-lg font-medium text-gray-500">Loading teams...</p>
    </div>
  ) : (
    filteredTeams.map((team) => (
      <Link href={`/teams/${team.id}`} key={team.id}>
        <Card className="group hover:scale-102 transition-all duration-200 backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              {team.name}
            </CardTitle>
            <button className="opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreVertical className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400">{team.description}</p>
          </CardContent>
        </Card>
      </Link>
    ))
  )}
  {!loading && filteredTeams.length === 0 && (
    <p className="text-center text-gray-500 col-span-full">You are not a member of any team.</p>
  )}
</div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Join a Team</h2>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <input
              type="text"
              placeholder="Paste your invite link here..."
              value={inviteLink}
              onChange={(e) => setInviteLink(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {error && <p className="text-red-500 mt-2">{error}</p>}
            {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}
            <div className="mt-4 flex justify-end space-x-4">
              <button
                onClick={() => setShowInviteModal(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleJoinTeam}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Join Team
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
